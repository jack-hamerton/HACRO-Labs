/// <reference path="../pb_data/types.d.ts" />
const roundCurrencyWithdrawal = (value) => Math.round((Number(value) || 0) * 100) / 100;

function normalizePhone(phoneValue) {
  let value = `${phoneValue || ""}`.trim();
  if (!value) {
    return "";
  }
  if (value.startsWith("+")) {
    value = value.slice(1);
  }
  if (value.startsWith("0")) {
    value = `254${value.slice(1)}`;
  }
  if (!value.startsWith("254")) {
    value = `254${value}`;
  }
  return value;
}

async function triggerB2CPayout(phoneNumber, amount, reference, remarks) {
  const shortCode = process.env.MPESA_SHORTCODE;
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  const initiatorName = process.env.MPESA_B2C_INITIATOR_NAME || process.env.MPESA_INITIATOR_NAME || "";
  const securityCredential = process.env.MPESA_B2C_SECURITY_CREDENTIAL || process.env.MPESA_SECURITY_CREDENTIAL || "";

  if (!shortCode || !consumerKey || !consumerSecret || !initiatorName || !securityCredential) {
    throw new Error("M-Pesa B2C configuration incomplete");
  }

  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
  const authResponse = await fetch("https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });

  const authData = await authResponse.json();
  const accessToken = authData.access_token;

  const payload = {
    InitiatorName: initiatorName,
    SecurityCredential: securityCredential,
    CommandID: "BusinessPayment",
    Amount: Math.round(amount),
    PartyA: shortCode,
    PartyB: phoneNumber,
    Remarks: remarks || "Hacro Labs withdrawal payout",
    Occasion: reference,
    QueueTimeOutURL: process.env.MPESA_B2C_QUEUE_TIMEOUT_URL || process.env.MPESA_CALLBACK_URL || "https://yourdomain.com/api/mpesa/callback",
    ResultURL: process.env.MPESA_B2C_RESULT_URL || process.env.MPESA_CALLBACK_URL || "https://yourdomain.com/api/mpesa/callback",
  };

  const payoutResponse = await fetch("https://api.safaricom.co.ke/mpesa/b2c/v1/paymentrequest", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return payoutResponse.json();
}

onRecordCreate((e) => {
  const withdrawal = e.record;
  const memberId = withdrawal.get("member_id");
  const withdrawalType = withdrawal.get("withdrawal_type");

  if (!memberId || withdrawalType !== "85_percent") {
    e.next();
    return;
  }

  try {
    const allSavings = $app.findRecordsByFilter("savings", `member_id = "${memberId}"`, "-date");

    if (!allSavings || allSavings.length === 0) {
      console.warn(`No savings found for member ${memberId}`);
      e.next();
      return;
    }

    let totalSavings = 0;
    allSavings.forEach((saving) => {
      totalSavings += roundCurrencyWithdrawal(saving.get("amount") || 0);
    });

    const withdrawalAmount = roundCurrencyWithdrawal(totalSavings * 0.85);
    const carryForwardAmount = roundCurrencyWithdrawal(totalSavings - withdrawalAmount);

    withdrawal.set("total_savings_at_withdrawal", roundCurrencyWithdrawal(totalSavings));
    withdrawal.set("withdrawal_amount_85", withdrawalAmount);
    withdrawal.set("carry_forward_15", carryForwardAmount);
    withdrawal.set("status", "pending");
    withdrawal.set("notes", "Pending admin approval and payout review.");

    console.log(`Withdrawal request staged for member ${memberId}: Withdrawal=${withdrawalAmount}, CarryForward=${carryForwardAmount}`);
  } catch (error) {
    console.error("Withdrawal automation error:", error);
  }

  e.next();
});

onRecordUpdate(async (e) => {
  const withdrawal = e.record;
  const originalRecord = e.record.original();
  const memberId = withdrawal.get("member_id");
  const newStatus = withdrawal.get("status");
  const oldStatus = originalRecord.get("status");
  const withdrawalType = withdrawal.get("withdrawal_type");

  if (!memberId || withdrawalType !== "85_percent" || newStatus !== "approved" || oldStatus === "approved") {
    e.next();
    return;
  }

  try {
    const withdrawalAmount = roundCurrencyWithdrawal(withdrawal.get("withdrawal_amount_85") || 0);
    const carryForwardAmount = roundCurrencyWithdrawal(withdrawal.get("carry_forward_15") || 0);

    let groupId = null;
    try {
      const groupMember = $app.findRecordsByFilter("group_members", `member_id = "${memberId}"`, "-created");
      if (groupMember && groupMember.length > 0) {
        groupId = groupMember[0].get("group_id");
      }
    } catch (err) {
      console.warn("Group lookup failed for withdrawal automation", err);
    }

    if (carryForwardAmount > 0 && groupId) {
      const carryForwardRecord = new Record("savings");
      carryForwardRecord.set("member_id", memberId);
      carryForwardRecord.set("group_id", groupId);
      carryForwardRecord.set("amount", carryForwardAmount);
      carryForwardRecord.set("date", new Date().toISOString());
      carryForwardRecord.set("description", "Carry forward from 85/15 withdrawal");
      $app.save(carryForwardRecord);
    }

    const historyRecord = new Record("contributions_history");
    historyRecord.set("member_id", memberId);
    historyRecord.set("group_id", groupId);
    historyRecord.set("type", "withdrawal");
    historyRecord.set("amount", withdrawalAmount);
    historyRecord.set("date", new Date().toISOString());
    historyRecord.set("description", "85% withdrawal processed");
    historyRecord.set("balance", withdrawalAmount);
    $app.save(historyRecord);

    const member = $app.findRecordById("members", memberId);
    const memberPhone = normalizePhone(member?.get("phone") || member?.get("phone_number") || "");

    const ledgerEntries = $app.findRecordsByFilter("contributions_history", "member_id = '" + memberId + "'", { limit: 1000 });
    const runningBalance = ledgerEntries.reduce((sum, entry) => sum + (Number(entry.get("amount")) || 0), 0) - withdrawalAmount;
    const payoutLedger = new Record("contributions_history");
    payoutLedger.set("member_id", memberId);
    payoutLedger.set("group_id", groupId);
    payoutLedger.set("type", "mpesa_b2c_payout");
    payoutLedger.set("amount", -withdrawalAmount);
    payoutLedger.set("date", new Date().toISOString());
    payoutLedger.set("description", `M-Pesa B2C withdrawal payout for ${withdrawalType} approval`);
    payoutLedger.set("balance", runningBalance);
    $app.save(payoutLedger);

    if (memberPhone) {
      try {
        const payoutResult = await triggerB2CPayout(memberPhone, withdrawalAmount, withdrawal.id, "Savings withdrawal payout");
        const payoutStatusCode = payoutResult.ResponseCode || payoutResult.errorCode || "unknown";
        const payoutStatusDescription = payoutResult.ResponseDescription || payoutResult.errorMessage || "Payout request sent";

        const payoutNotification = new Record("notifications");
        payoutNotification.set("member_id", memberId);
        payoutNotification.set("type", "payout_initiated");
        payoutNotification.set("title", payoutStatusCode === "0" ? "Withdrawal Payout Initiated" : "Withdrawal Payout Review Required");
        payoutNotification.set("message", `Your approved withdrawal amount of KES ${withdrawalAmount.toLocaleString()} has been requested to ${memberPhone}. Status: ${payoutStatusDescription}`);
        payoutNotification.set("read_status", false);
        $app.save(payoutNotification);
      } catch (payoutError) {
        const payoutNotification = new Record("notifications");
        payoutNotification.set("member_id", memberId);
        payoutNotification.set("type", "payout_failed");
        payoutNotification.set("title", "Withdrawal Payout Setup Failed");
        payoutNotification.set("message", `The withdrawal payout could not be sent automatically. Please contact admin for manual processing. Error: ${payoutError.message}`);
        payoutNotification.set("read_status", false);
        $app.save(payoutNotification);
      }
    }

    withdrawal.set("withdrawal_date", new Date().toISOString());
    withdrawal.set("next_withdrawal_date", new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000).toISOString());
    withdrawal.set("status", "processed");
    $app.save(withdrawal);

    const notification = new Record("notifications");
    notification.set("member_id", memberId);
    notification.set("type", "withdrawal_processed");
    notification.set("title", "Withdrawal Processed");
    notification.set("message", `Your approved 85% savings withdrawal of KES ${withdrawalAmount.toLocaleString()} has been processed. KES ${carryForwardAmount.toLocaleString()} was carried forward to your next cycle.`);
    notification.set("read_status", false);
    $app.save(notification);
  } catch (error) {
    console.error("Withdrawal post-processing error:", error);
  }

  e.next();
});
