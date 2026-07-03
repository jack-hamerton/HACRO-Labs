/// <reference path="../pb_data/types.d.ts" />
onRecordUpdate((e) => {
  // Comprehensive loan disbursement automation with new GIL/IL rules
  const loanRecord = e.record;
  const originalRecord = e.record.original();

  const newStatus = loanRecord.get("status");
  const oldStatus = originalRecord.get("status");
  const memberId = loanRecord.get("member_id");
  const groupId = loanRecord.get("group_id");
  const loanAmount = loanRecord.get("amount");
  const loanType = loanRecord.get("loan_type");

  // Only process when status changes to 'active' (disbursed)
  if (newStatus !== "active" || oldStatus === "active") {
    e.next();
    return;
  }

  if (!memberId || !groupId || !loanAmount) {
    e.next();
    return;
  }

  try {
    const disbursementDate = new Date().toISOString();

    // 1. Update loan with disbursement date
    loanRecord.set("disbursement_date", disbursementDate);
    $app.save(loanRecord);

    // 2. Create disbursement history record
    const disbursementHistory = new Record("contributions_history");
    disbursementHistory.set("member_id", memberId);
    disbursementHistory.set("group_id", groupId);
    disbursementHistory.set("type", "loan_disbursement");
    disbursementHistory.set("amount", loanAmount);
    disbursementHistory.set("date", disbursementDate);
    disbursementHistory.set("description", "Loan Disbursement");
    disbursementHistory.set("balance", loanAmount); // Initial loan balance
    $app.save(disbursementHistory);

    // 3. Notify the borrower
    const disbursementNotification = new Record("notifications");
    disbursementNotification.set("member_id", memberId);
    disbursementNotification.set("type", "disbursement");
    disbursementNotification.set("title", "Loan Disbursed");
    disbursementNotification.set("message", `Your ${loanType} loan of KES ${loanAmount.toLocaleString()} has been disbursed. Repayment over 3 months with 1 month grace period.`);
    disbursementNotification.set("read_status", false);
    $app.save(disbursementNotification);

    // 5. Notify group members about the disbursement
    const groupMembers = $app.findRecordsByFilter("group_members", "group_id = '" + groupId + "'", { limit: 1000 });

    groupMembers.forEach((gm) => {
      const gmMemberId = gm.get("member_id");

      // Don't notify the borrower again
      if (gmMemberId === memberId) {
        return;
      }

      const groupNotification = new Record("notifications");
      groupNotification.set("member_id", gmMemberId);
      groupNotification.set("type", "disbursement");
      groupNotification.set("title", "Loan Disbursement");
      groupNotification.set("message", `A ${loanType} loan of KES ${loanAmount.toLocaleString()} has been disbursed to a group member`);
      groupNotification.set("read_status", false);
      $app.save(groupNotification);
    });

    // 6. For GIL loans, update guarantor statuses to 'active'
    if (loanType === "GIL") {
      const guarantors = $app.findRecordsByFilter("loan_guarantors", "loan_id = '" + loanRecord.id + "'", { limit: 1000 });

      guarantors.forEach((guarantor) => {
        guarantor.set("status", "active");
        $app.save(guarantor);
      });
    }

  } catch (err) {
    console.log("Error in loan disbursement automation: " + err.message);
  }

  e.next();
}, "loans");