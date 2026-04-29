import 'dotenv/config';
import axios from 'axios';
import logger from './logger.js';

const MPESA_AUTH_URL = 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
const MPESA_STK_PUSH_URL = 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
const MPESA_STK_QUERY_URL = 'https://api.safaricom.co.ke/mpesa/stkpushquery/v1/query';

let cachedAccessToken = null;
let tokenExpiryTime = null;

/**
 * Get M-Pesa access token
 * @returns {Promise<string>} Access token
 */
export async function getAccessToken() {
  // Return cached token if still valid
  if (cachedAccessToken && tokenExpiryTime && Date.now() < tokenExpiryTime) {
    return cachedAccessToken;
  }

  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;

  if (!consumerKey || !consumerSecret) {
    throw new Error('M-Pesa credentials not configured: MPESA_CONSUMER_KEY or MPESA_CONSUMER_SECRET missing');
  }

  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

  try {
    const response = await axios.get(MPESA_AUTH_URL, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    cachedAccessToken = response.data.access_token;
    // Cache token for 55 minutes (expires in 60 minutes)
    tokenExpiryTime = Date.now() + 55 * 60 * 1000;

    logger.info('M-Pesa access token obtained successfully');
    return cachedAccessToken;
  } catch (error) {
    logger.error('Failed to get M-Pesa access token:', error.response?.data || error.message);
    throw new Error(`M-Pesa authentication failed: ${error.response?.data?.error_description || error.message}`);
  }
}

/**
 * Generate timestamp in format YYYYMMDDHHmmss
 * @returns {string} Timestamp
 */
function generateTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

/**
 * Generate M-Pesa password (base64 encoded: BusinessShortCode + Passkey + Timestamp)
 * @param {string} timestamp - Timestamp in YYYYMMDDHHmmss format
 * @returns {string} Base64 encoded password
 */
function generatePassword(timestamp) {
  const shortCode = process.env.MPESA_SHORTCODE;
  const passkey = process.env.MPESA_PASSKEY;

  if (!shortCode || !passkey) {
    throw new Error('M-Pesa configuration missing: MPESA_SHORTCODE or MPESA_PASSKEY');
  }

  const passwordString = `${shortCode}${passkey}${timestamp}`;
  return Buffer.from(passwordString).toString('base64');
}

/**
 * Initiate STK Push request
 * @param {string} phoneNumber - Customer phone number (format: 254XXXXXXXXX)
 * @param {number} amount - Amount to charge
 * @param {string} email - Customer email
 * @param {string} firstName - Customer first name
 * @param {string} lastName - Customer last name
 * @returns {Promise<Object>} STK Push response
 */
export async function initiateStkPush(phoneNumber, amount, email, firstName, lastName) {
  const shortCode = process.env.MPESA_SHORTCODE;

  if (!shortCode) {
    throw new Error('M-Pesa configuration missing: MPESA_SHORTCODE');
  }

  if (!phoneNumber || !amount || !email) {
    throw new Error('Missing required parameters: phoneNumber, amount, email');
  }

  const timestamp = generateTimestamp();
  const password = generatePassword(timestamp);
  const accessToken = await getAccessToken();

  const payload = {
    BusinessShortCode: shortCode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: Math.round(amount),
    PartyA: phoneNumber,
    PartyB: shortCode,
    PhoneNumber: phoneNumber,
    CallBackURL: 'https://yourdomain.com/hcgi/api/mpesa/callback',
    AccountReference: email,
    TransactionDesc: 'Hacro Labs Registration Fee',
  };

  try {
    const response = await axios.post(MPESA_STK_PUSH_URL, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    logger.info(`STK Push initiated for ${phoneNumber}:`, response.data);

    return {
      checkoutRequestId: response.data.CheckoutRequestID,
      responseCode: response.data.ResponseCode,
      responseDescription: response.data.ResponseDescription,
      merchantRequestId: response.data.MerchantRequestID,
    };
  } catch (error) {
    logger.error('STK Push failed:', error.response?.data || error.message);
    throw new Error(`STK Push failed: ${error.response?.data?.errorMessage || error.message}`);
  }
}

/**
 * Check payment status
 * @param {string} checkoutRequestId - Checkout request ID from STK Push
 * @returns {Promise<Object>} Payment status
 */
export async function checkPaymentStatus(checkoutRequestId) {
  const shortCode = process.env.MPESA_SHORTCODE;

  if (!shortCode) {
    throw new Error('M-Pesa configuration missing: MPESA_SHORTCODE');
  }

  if (!checkoutRequestId) {
    throw new Error('Missing required parameter: checkoutRequestId');
  }

  const timestamp = generateTimestamp();
  const password = generatePassword(timestamp);
  const accessToken = await getAccessToken();

  const payload = {
    BusinessShortCode: shortCode,
    Password: password,
    Timestamp: timestamp,
    CheckoutRequestID: checkoutRequestId,
  };

  try {
    const response = await axios.post(MPESA_STK_QUERY_URL, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    logger.info(`Payment status checked for ${checkoutRequestId}:`, response.data);

    return {
      checkoutRequestId: response.data.CheckoutRequestID,
      resultCode: response.data.ResultCode,
      resultDesc: response.data.ResultDesc,
      merchantRequestId: response.data.MerchantRequestID,
    };
  } catch (error) {
    logger.error('Payment status check failed:', error.response?.data || error.message);
    throw new Error(`Payment status check failed: ${error.response?.data?.errorMessage || error.message}`);
  }
}

export default {
  getAccessToken,
  initiateStkPush,
  checkPaymentStatus,
};
