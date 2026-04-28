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
  const { phoneNumber, amount, email, firstName, lastName } = req.body;

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
    merchantRequestId: stkPushResponse.merchantRequestId,
  });

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

    // Update payment record in PocketBase if email is available
    if (paymentInfo && paymentInfo.email) {
      // Try to find and update payment record
      // This assumes you have a 'payments' collection in PocketBase
      // Adjust collection name and fields as needed
      const email = paymentInfo.email;

      // Create or update payment record
      const paymentRecord = {
        email,
        phone_number: phoneNumber,
        amount,
        checkout_request_id: checkoutRequestId,
        merchant_request_id: merchantRequestId,
        mpesa_reference: mpesaReceiptNumber,
        payment_status: 'completed',
        payment_date: transactionDate,
        result_code: resultCode,
        result_desc: resultDesc,
      };

      // Try to update existing payment record or create new one
      const existingPayments = await pb.collection('payments').getFullList({
        filter: `checkout_request_id = "${checkoutRequestId}"`,
      });

      if (existingPayments.length > 0) {
        // Update existing record
        await pb.collection('payments').update(existingPayments[0].id, paymentRecord);
        logger.info(`Payment record updated in PocketBase for ${checkoutRequestId}`);
      } else {
        // Create new record
        await pb.collection('payments').create(paymentRecord);
        logger.info(`Payment record created in PocketBase for ${checkoutRequestId}`);
      }
    }
  } else {
    logger.warn(`Payment failed for ${checkoutRequestId}:`, {
      resultCode,
      resultDesc,
    });

    // Update payment record with failure status if email is available
    if (paymentInfo && paymentInfo.email) {
      const email = paymentInfo.email;

      const paymentRecord = {
        email,
        checkout_request_id: checkoutRequestId,
        merchant_request_id: merchantRequestId,
        payment_status: 'failed',
        result_code: resultCode,
        result_desc: resultDesc,
      };

      const existingPayments = await pb.collection('payments').getFullList({
        filter: `checkout_request_id = "${checkoutRequestId}"`,
      });

      if (existingPayments.length > 0) {
        await pb.collection('payments').update(existingPayments[0].id, paymentRecord);
        logger.info(`Payment failure recorded in PocketBase for ${checkoutRequestId}`);
      } else {
        await pb.collection('payments').create(paymentRecord);
        logger.info(`Payment failure record created in PocketBase for ${checkoutRequestId}`);
      }
    }
  }

  // Acknowledge receipt to M-Pesa (return ResultCode: 0)
  res.json({ ResultCode: 0 });
});

export default router;