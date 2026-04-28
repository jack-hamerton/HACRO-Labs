/// <reference path="../pb_data/types.d.ts" />
onRecordUpdate((e) => {
  // Admin loan disbursement approval automation
  const loanRecord = e.record;
  const originalRecord = e.record.original();

  const newStatus = loanRecord.get("status");
  const oldStatus = originalRecord.get("status");
  const memberId = loanRecord.get("member_id");
  const loanAmount = loanRecord.get("amount");
  const loanType = loanRecord.get("loan_type");

  // Only process when status changes to 'approved_by_admin' for disbursement
  if (newStatus !== "approved_by_admin" || oldStatus === "approved_by_admin") {
    e.next();
    return;
  }

  if (!memberId || !loanAmount) {
    e.next();
    return;
  }

  try {
    // Set loan status to active (disbursed)
    loanRecord.set("status", "active");
    loanRecord.set("disbursement_date", new Date().toISOString());
    $app.save(loanRecord);

    // Notify borrower of admin approval and disbursement
    const disbursementNotification = new Record("notifications");
    disbursementNotification.set("member_id", memberId);
    disbursementNotification.set("type", "admin_disbursement_approval");
    disbursementNotification.set("title", "Loan Approved & Disbursed");
    disbursementNotification.set("message", `Your ${loanType} loan of KES ${loanAmount.toLocaleString()} has been approved by admin and disbursed. You can now access the funds.`);
    disbursementNotification.set("read_status", false);
    $app.save(disbursementNotification);

    // For GIL loans, notify all guarantors that disbursement has occurred
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