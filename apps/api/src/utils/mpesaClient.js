import 'dotenv/config';
import axios from 'axios';
import logger from './logger.js';

const getMpesaBaseUrl = () => {
  return (process.env.MPESA_MODE || '').toLowerCase() === 'sandbox'
    ? 'https://sandbox.safaricom.co.ke'
    : 'https://api.safaricom.co.ke';
};

const MPESA_AUTH_URL = `${getMpesaBaseUrl()}/oauth/v1/generate?grant_type=client_credentials`;
const MPESA_STK_PUSH_URL = `${getMpesaBaseUrl()}/mpesa/stkpush/v1/processrequest`;
const MPESA_STK_QUERY_URL = `${getMpesaBaseUrl()}/mpesa/stkpushquery/v1/query`;

let cachedAccessToken = null;
let tokenExpiryTime = null;
const sandboxPayments = new Map();

export const isMpesaSandbox = () => {
  return (process.env.MPESA_MODE || '').toLowerCase() === 'sandbox';
};

 

                          

                                          

 
export async function getAccessToken() {
  

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
    

    tokenExpiryTime = Date.now() + 55 * 60 * 1000;

    logger.info('M-Pesa access token obtained successfully');
    return cachedAccessToken;
  } catch (error) {
    logger.error('Failed to get M-Pesa access token:', error.response?.data || error.message);
    throw new Error(`M-Pesa authentication failed: ${error.response?.data?.error_description || error.message}`);
  }
}

 

                                              

                              

 
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

 

                                                                                     

                                                                 

                                            

 
function getMpesaShortCode() {
  return (process.env.MPESA_MODE || '').toLowerCase() === 'sandbox'
    ? process.env.MPESA_SANDBOX_SHORTCODE || process.env.MPESA_SHORTCODE
    : process.env.MPESA_SHORTCODE;
}

function getMpesaPasskey() {
  return (process.env.MPESA_MODE || '').toLowerCase() === 'sandbox'
    ? process.env.MPESA_SANDBOX_PASSKEY || process.env.MPESA_PASSKEY
    : process.env.MPESA_PASSKEY;
}

function generatePassword(timestamp) {
  const shortCode = getMpesaShortCode();
  const passkey = getMpesaPasskey();

  if (!shortCode || !passkey) {
    throw new Error('M-Pesa configuration missing: MPESA_SHORTCODE or MPESA_PASSKEY');
  }

  const passwordString = `${shortCode}${passkey}${timestamp}`;
  return Buffer.from(passwordString).toString('base64');
}

 

                             

                                                                              

                                             

                                                                        

                                               

 
export async function initiateStkPush(phoneNumber, amount, purpose) {
  const shortCode = getMpesaShortCode();
  const passkey = getMpesaPasskey();

  if (isMpesaSandbox() && (!shortCode || !passkey)) {
    throw new Error('Sandbox M-Pesa requires MPESA_SANDBOX_SHORTCODE and MPESA_SANDBOX_PASSKEY to initiate an STK push. Set these values in apps/api/.env for sandbox testing.');
  }

  if (!shortCode) {
    throw new Error('M-Pesa configuration missing: MPESA_SHORTCODE');
  }

  if (!phoneNumber || !amount) {
    throw new Error('Missing required parameters: phoneNumber, amount');
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
    CallBackURL: process.env.MPESA_CALLBACK_URL || 'https://yourdomain.com/hcgi/api/mpesa/callback',
    AccountReference: purpose || 'Hacro Labs Payment',
    TransactionDesc: purpose || 'Hacro Labs Payment',
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

 

                       

                                                                        

                                            

 
export async function checkPaymentStatus(checkoutRequestId) {
  if (isMpesaSandbox()) {
    const shortCode = getMpesaShortCode();
    const passkey = getMpesaPasskey();

    if (!shortCode || !passkey) {
      throw new Error('Sandbox M-Pesa requires MPESA_SANDBOX_SHORTCODE and MPESA_SANDBOX_PASSKEY to check payment status.');
    }
  }

  const shortCode = getMpesaShortCode();

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
