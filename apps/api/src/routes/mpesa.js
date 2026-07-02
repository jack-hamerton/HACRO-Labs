import express from 'express';
import { initiateStkPush, checkPaymentStatus } from '../utils/mpesaClient.js';
import { cachePayment, getPayment } from '../utils/paymentCache.js';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

const router = express.Router();

/**
 * POST /mpesa/stk-push
 * Initiate M-Pesa STK Push payment request
 */
router.post('/stk-push', async (req, res) => {
  const { phoneNumber, amount, email, firstName, lastName, purpose } = req.body;

  // Validate required fields
  if (!phoneNumber || !amount || !email || !firstName || !lastName) {
    return res.status(400).json({
      error: 'Missing required fields: phoneNumber, amount, email, firstName, lastName',
    });
  }

  // Validate amount
  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({
      error: 'Amount must be a positive number',
    });
  }

  // Validate phone number format (should be 254XXXXXXXXX)
  if (!/^254\d{9}$/.test(phoneNumber)) {
    return res.status(400).json({
      error: 'Phone number must be in format 254XXXXXXXXX',
    });
  }

  // Call M-Pesa API to initiate STK Push
  const stkPushResponse = await initiateStkPush(phoneNumber, amount, email, firstName, lastName);

  // Cache payment request for webhook matching
  cachePayment(stkPushResponse.checkoutRequestId, {
    email,
    phoneNumber,
    amount,
    firstName,
    lastName,
    purpose,
    merchantRequestId: stkPushResponse.merchantRequestId,
  });

  try {
    await pb.collection('donations').create({
      donor_name: `${firstName} ${lastName}`.trim(),
      donor_email: email,
      donor_phone: phoneNumber,
      amount,
      purpose: purpose || 'General support',
      payment_status: 'pending',
      checkout_request_id: stkPushResponse.checkoutRequestId,
      merchant_request_id: stkPushResponse.merchantRequestId,
    }, { $autoCancel: false });
    logger.info(`Donation record created for ${email}:`, stkPushResponse.checkoutRequestId);
  } catch (donationError) {
    logger.warn('Unable to create donation record in PocketBase:', donationError?.message || donationError);
  }

  logger.info(`STK Push cached for ${email}:`, stkPushResponse.checkoutRequestId);

  res.json({
    checkoutRequestId: stkPushResponse.checkoutRequestId,
    responseCode: stkPushResponse.responseCode,
    responseDescription: stkPushResponse.responseDescription,
  });
});

/**
 * GET /mpesa/check-payment/:checkoutRequestId
 * Check payment status for a given checkout request ID
 */
router.get('/check-payment/:checkoutRequestId', async (req, res) => {
  const { checkoutRequestId } = req.params;

  if (!checkoutRequestId) {
    return res.status(400).json({
      error: 'checkoutRequestId is required',
    });
  }

  // Query M-Pesa API for payment status
  const statusResponse = await checkPaymentStatus(checkoutRequestId);

  res.json({
    checkoutRequestId: statusResponse.checkoutRequestId,
    resultCode: statusResponse.resultCode,
    resultDesc: statusResponse.resultDesc,
  });
});

/**
 * POST /mpesa/callback
 * Receive M-Pesa payment callbacks
 */
router.post('/callback', async (req, res) => {
  const { Body } = req.body;

  if (!Body || !Body.stkCallback) {
    logger.warn('Invalid callback payload received:', req.body);
    return res.status(400).json({ error: 'Invalid callback payload' });
  }

  const stkCallback = Body.stkCallback;
  const checkoutRequestId = stkCallback.CheckoutRequestID;
  const merchantRequestId = stkCallback.MerchantRequestID;
  const resultCode = stkCallback.ResultCode;
  const resultDesc = stkCallback.ResultDesc;
  const callbackMetadata = stkCallback.CallbackMetadata;

  logger.info(`M-Pesa callback received for ${checkoutRequestId}:`, {
    resultCode,
    resultDesc,
  });

  // Get cached payment info
  const paymentInfo = getPayment(checkoutRequestId);

  if (!paymentInfo) {
    logger.warn(`Payment info not found in cache for ${checkoutRequestId}`);
  }

  // Check if payment was successful (resultCode = 0)
  if (resultCode === '0' && callbackMetadata) {
    // Extract callback metadata
    const metadata = {};
    if (callbackMetadata.Item && Array.isArray(callbackMetadata.Item)) {
      callbackMetadata.Item.forEach((item) => {
        metadata[item.Name] = item.Value;
      });
    }

    const mpesaReceiptNumber = metadata.MpesaReceiptNumber;
    const transactionDate = metadata.TransactionDate;
    const amount = metadata.Amount;
    const phoneNumber = metadata.PhoneNumber;

    logger.info(`Payment successful for ${checkoutRequestId}:`, {
      mpesaReceiptNumber,
      amount,
      phoneNumber,
    });

    // Update donation/payment record in PocketBase if email is available
    if (paymentInfo && paymentInfo.email) {
      const email = paymentInfo.email;

      const donationRecord = {
        donor_name: `${paymentInfo.firstName || ''} ${paymentInfo.lastName || ''}`.trim() || email,
        donor_email: email,
        donor_phone: paymentInfo.phoneNumber || '',
        amount,
        purpose: paymentInfo.purpose || 'General support',
        checkout_request_id: checkoutRequestId,
        merchant_request_id: merchantRequestId,
        mpesa_reference: mpesaReceiptNumber,
        payment_status: 'completed',
        payment_date: transactionDate || new Date().toISOString(),
        result_code: resultCode,
        result_desc: resultDesc,
      };

      try {
        const existingDonations = await pb.collection('donations').getFullList({
          filter: `checkout_request_id = "${checkoutRequestId}"`,
        });

        if (existingDonations.length > 0) {
          await pb.collection('donations').update(existingDonations[0].id, donationRecord);
          logger.info(`Donation record updated in PocketBase for ${checkoutRequestId}`);
        } else {
          await pb.collection('donations').create(donationRecord);
          logger.info(`Donation record created in PocketBase for ${checkoutRequestId}`);
        }
      } catch (donationError) {
        logger.warn('Unable to save completed donation record:', donationError?.message || donationError);
      }
    }
  } else {
    logger.warn(`Payment failed for ${checkoutRequestId}:`, {
      resultCode,
      resultDesc,
    });

    // Update donation record with failure status if email is available
    if (paymentInfo && paymentInfo.email) {
      const email = paymentInfo.email;

      const donationRecord = {
        donor_name: `${paymentInfo.firstName || ''} ${paymentInfo.lastName || ''}`.trim() || email,
        donor_email: email,
        donor_phone: paymentInfo.phoneNumber || '',
        amount: paymentInfo.amount,
        purpose: paymentInfo.purpose || 'General support',
        checkout_request_id: checkoutRequestId,
        merchant_request_id: merchantRequestId,
        payment_status: 'failed',
        result_code: resultCode,
        result_desc: resultDesc,
      };

      try {
        const existingDonations = await pb.collection('donations').getFullList({
          filter: `checkout_request_id = "${checkoutRequestId}"`,
        });

        if (existingDonations.length > 0) {
          await pb.collection('donations').update(existingDonations[0].id, donationRecord);
          logger.info(`Donation failure recorded in PocketBase for ${checkoutRequestId}`);
        } else {
          await pb.collection('donations').create(donationRecord);
          logger.info(`Donation failure record created in PocketBase for ${checkoutRequestId}`);
        }
      } catch (donationError) {
        logger.warn('Unable to save failed donation record:', donationError?.message || donationError);
      }
    }
  }

  // Acknowledge receipt to M-Pesa (return ResultCode: 0)
  res.json({ ResultCode: 0 });
});

export default router;
