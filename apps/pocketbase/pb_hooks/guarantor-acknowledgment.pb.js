

onRecordAfterUpdateSuccess((e) => {
  

  const guarantorRecord = e.record;
  const loanId = guarantorRecord.get("loan_id");
  const guarantorId = guarantorRecord.get("guarantor_id");
  const collateralAmount = guarantorRecord.get("collateral_amount");
  const status = guarantorRecord.get("status");

  

  if (status !== "acknowledged") {
    e.next();
    return;
  }

  try {
    

    const loan = $app.findRecordById("loans", loanId);
    if (!loan || loan.get("loan_type") !== "GIL") {
      e.next();
      return;
    }

    const requestedAmount = loan.get("amount");
    const memberId = loan.get("member_id");

    

    const guarantorSavings = $app.findRecordsByFilter("savings", "member_id = '" + guarantorId + "'", { limit: 1 });
    if (guarantorSavings.length === 0) {
      console.log("Error: Guarantor has no savings record during acknowledgment");
      e.next();
      return;
    }

    const availableSavings = guarantorSavings[0].get("total_savings") || 0;

    

    if (collateralAmount > availableSavings) {
      console.log("Error: Insufficient savings during acknowledgment for guarantor " + guarantorId);
      e.next();
      return;
    }

    

    guarantorSavings[0].set("total_savings", availableSavings - collateralAmount);
    $app.save(guarantorSavings[0]);

    

    const collateralHistory = new Record("contributions_history");
    collateralHistory.set("member_id", guarantorId);
    collateralHistory.set("group_id", loan.get("group_id"));
    collateralHistory.set("type", "collateral_deduction");
    collateralHistory.set("amount", collateralAmount);
    collateralHistory.set("date", new Date().toISOString());
    collateralHistory.set("description", `Collateral for GIL loan ${loanId}`);
    collateralHistory.set("balance", availableSavings - collateralAmount);
    $app.save(collateralHistory);

    

    const deductionNotification = new Record("notifications");
    deductionNotification.set("member_id", guarantorId);
    deductionNotification.set("type", "collateral_deducted");
    deductionNotification.set("title", "Collateral Deducted");
    deductionNotification.set("message", `KES ${collateralAmount.toLocaleString()} has been deducted from your savings as collateral for the GIL loan. This amount will be returned when the loan is fully repaid.`);
    deductionNotification.set("read_status", false);
    $app.save(deductionNotification);

    

    const allGuarantors = $app.findRecordsByFilter("loan_guarantors", "loan_id = '" + loanId + "'", { limit: 1000 });

    let totalAcknowledgedCollateral = 0;
    let allAcknowledged = true;

    allGuarantors.forEach(g => {
      const gStatus = g.get("status");
      if (gStatus === "acknowledged") {
        totalAcknowledgedCollateral += g.get("collateral_amount") || 0;
      } else if (gStatus !== "rejected") {
        allAcknowledged = false;
      }
    });

    

    const borrowerSavings = $app.findRecordsByFilter("savings", "member_id = '" + memberId + "'", { limit: 1 });
    let borrowerSavingsAmount = 0;
    if (borrowerSavings.length > 0) {
      borrowerSavingsAmount = borrowerSavings[0].get("total_savings") || 0;
    }

    

    const requiredAmount = requestedAmount * 1.02;

    if (allAcknowledged && totalAcknowledgedCollateral + borrowerSavingsAmount >= requiredAmount) {
      

      loan.set("status", "ready_for_disbursement");
      loan.set("interest_rate", 0.02); 

      loan.set("repayment_period_months", 3); 

      loan.set("grace_period_months", 1); 

      $app.save(loan);

      

      const disbursementReadyNotification = new Record("notifications");
      disbursementReadyNotification.set("member_id", memberId);
      disbursementReadyNotification.set("type", "loan_ready_for_disbursement");
      disbursementReadyNotification.set("title", "Loan Ready for Disbursement");
      disbursementReadyNotification.set("message", `All guarantors have acknowledged their collateral commitments. Your GIL loan is now awaiting admin approval for disbursement.`);
      disbursementReadyNotification.set("read_status", false);
      $app.save(disbursementReadyNotification);

      

      const adminUsers = $app.findRecordsByFilter("admins", "role != 'super_admin'", { limit: 100 });
      adminUsers.forEach(admin => {
        const adminNotification = new Record("notifications");
        adminNotification.set("member_id", admin.id);
        adminNotification.set("type", "admin_loan_disbursement");
        adminNotification.set("title", "Loan Ready for Disbursement");
        adminNotification.set("message", `A GIL loan application for KES ${requestedAmount.toLocaleString()} has all guarantor acknowledgments and is ready for your disbursement approval.`);
        adminNotification.set("read_status", false);
        $app.save(adminNotification);
      });
    } else {
      

      loan.set("status", "pending_guarantor_acknowledgment");
      $app.save(loan);
    }

  } catch (err) {
    console.log("Error in guarantor acknowledgment automation: " + err.message);
  }

  e.next();
}, "loan_guarantors");