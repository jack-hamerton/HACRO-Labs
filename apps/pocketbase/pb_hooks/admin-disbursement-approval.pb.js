

const roundCurrencyDisbursement = (value) => Math.round((Number(value) || 0) * 100) / 100;

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
    Remarks: remarks || "Hacro Labs payout",
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

onRecordUpdate(async (e) => {
  const loanRecord = e.record;
  const originalRecord = e.record.original();

  const newStatus = loanRecord.get("status");
  const oldStatus = originalRecord.get("status");
  const memberId = loanRecord.get("member_id");
  const loanAmount = roundCurrencyDisbursement(loanRecord.get("amount") || 0);
  const loanType = loanRecord.get("loan_type");
  const interestRate = Number(loanRecord.get("interest_rate") || 0.01);
  const interestAmount = roundCurrencyDisbursement(loanAmount * interestRate);
  const totalRepayable = roundCurrencyDisbursement(loanAmount + interestAmount);
  const isApprovalStatus = ["approved", "approved_by_admin", "active"].includes(newStatus);

  if (!isApprovalStatus || oldStatus === newStatus) {
    e.next();
    return;
  }

  if (!memberId || !loanAmount) {
    e.next();
    return;
  }

  try {
    if (loanType === "GIL") {
      const guarantors = $app.findRecordsByFilter("loan_guarantors", "loan_id = '" + loanRecord.id + "'", { limit: 1000 });
      let allAcknowledged = true;
      let totalAcknowledgedCollateral = 0;

      guarantors.forEach((guarantor) => {
        const guarantorStatus = guarantor.get("status");
        if (guarantorStatus === "acknowledged") {
          totalAcknowledgedCollateral += guarantor.get("collateral_amount") || 0;
        } else if (guarantorStatus !== "rejected") {
          allAcknowledged = false;
        }
      });

      const borrowerSavings = $app.findRecordsByFilter("savings", "member_id = '" + memberId + "'", { limit: 1 });
      let borrowerSavingsAmount = 0;
      if (borrowerSavings.length > 0) {
        borrowerSavingsAmount = borrowerSavings[0].get("total_savings") || 0;
      }

      const requiredAmount = loanAmount * 1.02;
      if (!allAcknowledged || totalAcknowledgedCollateral + borrowerSavingsAmount < requiredAmount) {
        loanRecord.set("status", "pending_guarantor_acknowledgment");
        $app.save(loanRecord);

        const blockedNotification = new Record("notifications");
        blockedNotification.set("member_id", memberId);
        blockedNotification.set("type", "loan_disbursement_blocked");
        blockedNotification.set("title", "Disbursement Blocked");
        blockedNotification.set("message", "Your GIL loan cannot be disbursed yet because all guarantor collateral commitments must be acknowledged from their savings before admin approval can proceed.");
        blockedNotification.set("read_status", false);
        $app.save(blockedNotification);

        e.next();
        return;
      }
    }

    loanRecord.set("status", "active");
    loanRecord.set("disbursement_date", new Date().toISOString());
    $app.save(loanRecord);

    const member = $app.findRecordById("members", memberId);
    const memberPhone = normalizePhone(member?.get("phone") || member?.get("phone_number") || "");

    const disbursementNotification = new Record("notifications");
    disbursementNotification.set("member_id", memberId);
    disbursementNotification.set("type", "admin_disbursement_approval");
    disbursementNotification.set("title", "Loan Approved & Disbursed");
    disbursementNotification.set("message", `Your ${loanType} loan of KES ${loanAmount.toLocaleString()} has been approved by admin and disbursed. Principal: KES ${loanAmount.toLocaleString()}, interest: KES ${interestAmount.toLocaleString()}, estimated repayment total: KES ${totalRepayable.toLocaleString()}.`);
    disbursementNotification.set("read_status", false);
    $app.save(disbursementNotification);

    const ledgerEntries = $app.findRecordsByFilter("contributions_history", "member_id = '" + memberId + "'", { limit: 1000 });
    const runningBalance = ledgerEntries.reduce((sum, entry) => sum + (Number(entry.get("amount")) || 0), 0) - loanAmount;
    const payoutLedger = new Record("contributions_history");
    payoutLedger.set("member_id", memberId);
    payoutLedger.set("group_id", loanRecord.get("group_id"));
    payoutLedger.set("type", "mpesa_b2c_payout");
    payoutLedger.set("amount", -loanAmount);
    payoutLedger.set("date", new Date().toISOString());
    payoutLedger.set("description", `M-Pesa B2C loan payout for ${loanType} loan approval`);
    payoutLedger.set("balance", runningBalance);
    $app.save(payoutLedger);

    if (memberPhone) {
      try {
        const payoutResult = await triggerB2CPayout(memberPhone, loanAmount, loanRecord.id, `Loan payout ${loanType}`);
        const payoutStatusCode = payoutResult.ResponseCode || payoutResult.errorCode || "unknown";
        const payoutStatusDescription = payoutResult.ResponseDescription || payoutResult.errorMessage || "Payout request sent";

        const payoutNotification = new Record("notifications");
        payoutNotification.set("member_id", memberId);
        payoutNotification.set("type", "payout_initiated");
        payoutNotification.set("title", payoutStatusCode === "0" ? "Payout Initiated" : "Payout Review Required");
        payoutNotification.set("message", `The payout for KES ${loanAmount.toLocaleString()} has been requested to ${memberPhone}. Status: ${payoutStatusDescription}`);
        payoutNotification.set("read_status", false);
        $app.save(payoutNotification);
      } catch (payoutError) {
        const payoutNotification = new Record("notifications");
        payoutNotification.set("member_id", memberId);
        payoutNotification.set("type", "payout_failed");
        payoutNotification.set("title", "Payout Setup Failed");
        payoutNotification.set("message", `The payout request could not be sent automatically. Please contact admin for manual processing. Error: ${payoutError.message}`);
        payoutNotification.set("read_status", false);
        $app.save(payoutNotification);
      }
    }

    if (loanType === "GIL") {
      const guarantors = $app.findRecordsByFilter("loan_guarantors", "loan_id = '" + loanRecord.id + "' && status = 'acknowledged'", { limit: 1000 });

      guarantors.forEach((guarantor) => {
        const guarantorNotification = new Record("notifications");
        guarantorNotification.set("member_id", guarantor.get("guarantor_id"));
        guarantorNotification.set("type", "loan_disbursed");
        guarantorNotification.set("title", "Loan Disbursed");
        guarantorNotification.set("message", `The GIL loan you guaranteed has been disbursed. Your collateral of KES ${(guarantor.get("collateral_amount") || 0).toLocaleString()} is now active and will be returned when the loan is fully repaid.`);
        guarantorNotification.set("read_status", false);
        $app.save(guarantorNotification);
      });
    }
  } catch (err) {
    console.log("Error in admin disbursement approval automation: " + err.message);
  }

  e.next();
}, "loans");