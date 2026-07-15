

onRecordUpdate((e) => {
  

  const loanRecord = e.record;
  const originalRecord = e.record.original();

  const newStatus = loanRecord.get("status");
  const oldStatus = originalRecord.get("status");
  const memberId = loanRecord.get("member_id");
  const groupId = loanRecord.get("group_id");
  const loanAmount = loanRecord.get("amount");
  const loanType = loanRecord.get("loan_type");

  

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

    

    loanRecord.set("disbursement_date", disbursementDate);
    $app.save(loanRecord);

    

    const disbursementHistory = new Record("contributions_history");
    disbursementHistory.set("member_id", memberId);
    disbursementHistory.set("group_id", groupId);
    disbursementHistory.set("type", "loan_disbursement");
    disbursementHistory.set("amount", loanAmount);
    disbursementHistory.set("date", disbursementDate);
    disbursementHistory.set("description", "Loan Disbursement");
    disbursementHistory.set("balance", loanAmount); 

    $app.save(disbursementHistory);

    

    const disbursementNotification = new Record("notifications");
    disbursementNotification.set("member_id", memberId);
    disbursementNotification.set("type", "disbursement");
    disbursementNotification.set("title", "Loan Disbursed");
    disbursementNotification.set("message", `Your ${loanType} loan of KES ${loanAmount.toLocaleString()} has been disbursed. Repayment over 3 months with 1 month grace period.`);
    disbursementNotification.set("read_status", false);
    $app.save(disbursementNotification);

    

    const groupMembers = $app.findRecordsByFilter("group_members", "group_id = '" + groupId + "'", { limit: 1000 });

    groupMembers.forEach((gm) => {
      const gmMemberId = gm.get("member_id");

      

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