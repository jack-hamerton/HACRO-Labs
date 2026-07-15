import express from 'express';
import { initiateStkPush, checkPaymentStatus } from '../utils/mpesaClient.js';
import { cachePayment, getPayment } from '../utils/paymentCache.js';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

const router = express.Router();

const roundCurrency = (value) => Math.round((Number(value) || 0) * 100) / 100;

async function createLedgerEntry({ memberId, groupId, type, amount, date, description, balance }) {
  const transactionAmount = roundCurrency(amount || 0);
  const transactionDate = date || new Date().toISOString();
  const transactionBalance = roundCurrency(balance ?? transactionAmount);

  return pb.collection('contributions_history').create({
    member_id: memberId,
    group_id: groupId || null,
    type,
    amount: transactionAmount,
    date: transactionDate,
    description,
    balance: transactionBalance,
  }, { $autoCancel: false });
}

 

                       

                                           

 
router.post('/stk-push', async (req, res) => {
  const { phoneNumber, amount, email, firstName, lastName, purpose } = req.body;

  

  if (!phoneNumber || !amount) {
    return res.status(400).json({
      error: 'Missing required fields: phoneNumber, amount',
    });
  }

  

  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({
      error: 'Amount must be a positive number',
    });
  }

  

  if (!/^254\d{9}$/.test(phoneNumber)) {
    return res.status(400).json({
      error: 'Phone number must be in format 254XXXXXXXXX',
    });
  }

  

  const stkPushResponse = await initiateStkPush(phoneNumber, amount, purpose);

  

  cachePayment(stkPushResponse.checkoutRequestId, {
    email: email || null,
    phoneNumber,
    amount,
    firstName: firstName || null,
    lastName: lastName || null,
    purpose,
    merchantRequestId: stkPushResponse.merchantRequestId,
  });

  try {
    await pb.collection('donations').create({
      donor_name: `${firstName || ''} ${lastName || ''}`.trim() || phoneNumber,
      donor_email: email || null,
      donor_phone: phoneNumber,
      amount,
      purpose: purpose || 'General support',
      payment_status: 'pending',
      checkout_request_id: stkPushResponse.checkoutRequestId,
      merchant_request_id: stkPushResponse.merchantRequestId,
    }, { $autoCancel: false });
    logger.info(`Donation record created for ${phoneNumber}:`, stkPushResponse.checkoutRequestId);
  } catch (donationError) {
    logger.warn('Unable to create donation record in PocketBase:', donationError?.message || donationError);
  }

  logger.info(`STK Push cached for ${phoneNumber}:`, stkPushResponse.checkoutRequestId);

  res.json({
    checkoutRequestId: stkPushResponse.checkoutRequestId,
    responseCode: stkPushResponse.responseCode,
    responseDescription: stkPushResponse.responseDescription,
  });
});

 

                                              

                                                       

 
router.get('/check-payment/:checkoutRequestId', async (req, res) => {
  const { checkoutRequestId } = req.params;

  if (!checkoutRequestId) {
    return res.status(400).json({
      error: 'checkoutRequestId is required',
    });
  }

  

  const statusResponse = await checkPaymentStatus(checkoutRequestId);

  res.json({
    checkoutRequestId: statusResponse.checkoutRequestId,
    resultCode: statusResponse.resultCode,
    resultDesc: statusResponse.resultDesc,
  });
});

 

                       

                                   

 
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

  

  const paymentInfo = getPayment(checkoutRequestId);

  if (!paymentInfo) {
    logger.warn(`Payment info not found in cache for ${checkoutRequestId}`);
  }

  

  if (resultCode === '0' && callbackMetadata) {
    

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

    

    if (paymentInfo) {
      const donationRecord = {
        donor_name: `${paymentInfo.firstName || ''} ${paymentInfo.lastName || ''}`.trim() || phoneNumber,
        donor_email: paymentInfo.email || null,
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
          

          try {
            const existingPayments = await pb.collection('payments').getFullList({
              filter: `checkout_request_id = "${checkoutRequestId}"`,
            });

            if (existingPayments.length > 0) {
              const payment = existingPayments[0];
              const paymentRecord = {
                payment_status: 'completed',
                checkout_request_id: checkoutRequestId,
                merchant_request_id: merchantRequestId,
                mpesa_reference: mpesaReceiptNumber,
                payment_date: transactionDate || new Date().toISOString(),
              };
              await pb.collection('payments').update(payment.id, paymentRecord);
              logger.info(`Payment record updated in PocketBase for ${checkoutRequestId}`);

              let groupId = null;
              try {
                const memberGroups = await pb.collection('group_members').getFullList({
                  filter: `member_id="${payment.member_id}"`,
                  $autoCancel: false
                });
                if (memberGroups.length > 0) {
                  groupId = memberGroups[0].group_id;
                }
              } catch (groupError) {
                logger.warn('Unable to resolve member group for ledger entry:', groupError?.message || groupError);
              }

              const normalizedAmount = roundCurrency(amount || payment.amount || paymentInfo.amount || 0);
              const processedAt = transactionDate || new Date().toISOString();
              const ledgerType = payment.payment_type === 'savings'
                ? 'savings'
                : payment.payment_type === 'loan_repayment'
                  ? 'loan_repayment'
                  : payment.payment_type === 'registration'
                    ? 'registration_fee'
                    : 'mpesa_payment';

              try {
                const ledgerEntries = await pb.collection('contributions_history').getFullList({
                  filter: `member_id="${payment.member_id}"`,
                  $autoCancel: false
                });
                const runningBalance = ledgerEntries.reduce((sum, entry) => sum + (Number(entry.amount) || 0), 0) + normalizedAmount;

                await createLedgerEntry({
                  memberId: payment.member_id,
                  groupId,
                  type: ledgerType,
                  amount: normalizedAmount,
                  date: processedAt,
                  description: `M-Pesa ${payment.payment_type || 'payment'} received for ${paymentInfo.purpose || 'member payment'} (Ref: ${mpesaReceiptNumber})`,
                  balance: runningBalance,
                });
              } catch (ledgerError) {
                logger.warn('Unable to create payment ledger entry:', ledgerError?.message || ledgerError);
              }

              if (payment.payment_type === 'savings') {
                try {
                  const member = await pb.collection('members').getOne(payment.member_id);
                  if (member && groupId) {
                    await pb.collection('savings').create({
                      member_id: payment.member_id,
                      group_id: groupId,
                      amount: normalizedAmount,
                      date: processedAt,
                      description: `M-Pesa Savings Payment - Ref: ${mpesaReceiptNumber}`,
                    }, { $autoCancel: false });

                    logger.info(`Savings record created for member ${payment.member_id}:`, normalizedAmount);

                    const allSavings = await pb.collection('savings').getFullList({
                      filter: `member_id="${payment.member_id}"`,
                      $autoCancel: false
                    });
                    const currentBalance = allSavings.reduce((sum, s) => sum + (Number(s.amount) || 0), 0);

                    await pb.collection('contributions_history').create({
                      member_id: payment.member_id,
                      group_id: groupId,
                      type: 'savings',
                      amount: normalizedAmount,
                      date: processedAt,
                      description: `M-Pesa Savings - ${mpesaReceiptNumber}`,
                      balance: currentBalance,
                    }, { $autoCancel: false });

                    logger.info(`Contribution history created for member ${payment.member_id}`);
                  }
                } catch (savingsError) {
                  logger.warn('Unable to create savings record:', savingsError?.message || savingsError);
                }
              }
            } else {
              

              await pb.collection('donations').create(donationRecord);
              logger.info(`Donation record created in PocketBase for ${checkoutRequestId}`);
            }
          } catch (paymentError) {
            logger.warn('Unable to find payment record, creating donation instead:', paymentError?.message);
            await pb.collection('donations').create(donationRecord);
          }
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

    

    if (paymentInfo) {
      const donationRecord = {
        donor_name: `${paymentInfo.firstName || ''} ${paymentInfo.lastName || ''}`.trim() || paymentInfo.phoneNumber,
        donor_email: paymentInfo.email || null,
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
          

          try {
            const existingPayments = await pb.collection('payments').getFullList({
              filter: `checkout_request_id = "${checkoutRequestId}"`,
            });

            if (existingPayments.length > 0) {
              const paymentRecord = {
                payment_status: 'failed',
                result_code: resultCode,
                result_desc: resultDesc,
              };
              await pb.collection('payments').update(existingPayments[0].id, paymentRecord);
              logger.info(`Payment failure recorded in PocketBase for ${checkoutRequestId}`);
            } else {
              

              await pb.collection('donations').create(donationRecord);
              logger.info(`Donation failure record created in PocketBase for ${checkoutRequestId}`);
            }
          } catch (paymentError) {
            logger.warn('Unable to find payment record, creating donation instead:', paymentError?.message);
            await pb.collection('donations').create(donationRecord);
          }
        }
      } catch (donationError) {
        logger.warn('Unable to save failed donation record:', donationError?.message || donationError);
      }
    }
  }

  

  res.json({ ResultCode: 0 });
});

export default router;
