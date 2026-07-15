

onRecordUpdate((e) => {
  

  const approvalRecord = e.record;
  const originalRecord = e.record.original();

  const loanId = approvalRecord.get("loan_id");
  const isApproved = approvalRecord.get("approved");
  const wasApproved = originalRecord.get("approved");

  

  if (isApproved === wasApproved) {
    e.next();
    return;
  }

  if (!loanId) {
    e.next();
    return;
  }

  try {
    

    const loan = $app.findRecordById("loans", loanId);
    if (!loan) {
      e.next();
      return;
    }

    const loanType = loan.get("loan_type");

    

    if (loanType !== "GIL") {
      e.next();
      return;
    }

    const memberId = loan.get("member_id");

    

    const allApprovals = $app.findRecordsByFilter("loan_approvals", "loan_id = '" + loanId + "'", { limit: 1000 });

    

    const guarantorApprovals = allApprovals.filter(a => a.get("vote_type") === "guarantor_confirmation");
    const totalGuarantors = guarantorApprovals.length;
    const confirmedCount = guarantorApprovals.filter(a => a.get("approved")).length;

    if (confirmedCount === totalGuarantors && totalGuarantors > 0) {
      

      loan.set("status", "approved");
      $app.save(loan);

      

      const confirmationNotification = new Record("notifications");
      confirmationNotification.set("member_id", memberId);
      confirmationNotification.set("type", "approval");
      confirmationNotification.set("title", "GIL Approved");
      confirmationNotification.set("message", "Your Group Individual Loan has been approved - all guarantors confirmed");
      confirmationNotification.set("read_status", false);
      $app.save(confirmationNotification);

    } else if (confirmedCount < totalGuarantors) {
      

      const progressNotification = new Record("notifications");
      progressNotification.set("member_id", memberId);
      progressNotification.set("type", "vote");
      progressNotification.set("title", "Guarantor Confirmation Update");
      progressNotification.set("message", `${confirmedCount}/${totalGuarantors} guarantors have confirmed your loan`);
      progressNotification.set("read_status", false);
      $app.save(progressNotification);
    }

  } catch (err) {
    console.log("Error in loan voting automation: " + err.message);
  }

  e.next();
}, "loan_approvals");