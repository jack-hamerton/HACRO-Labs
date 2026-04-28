/// <reference path="../pb_data/types.d.ts" />
onRecordAfterUpdateSuccess((e) => {
  // Handle guarantor acknowledgment of collateral commitment
  const guarantorRecord = e.record;
  const loanId = guarantorRecord.get("loan_id");
  const guarantorId = guarantorRecord.get("guarantor_id");
  const collateralAmount = guarantorRecord.get("collateral_amount");
  const status = guarantorRecord.get("status");

  // Only process if status changed to acknowledged
  if (status !== "acknowledged") {
    e.next();
    return;
  }

  try {
    // Get loan details
    const loan = $app.findRecordById("loans", loanId);
    if (!loan || loan.get("loan_type") !== "GIL") {
      e.next();
      return;
    }

    const requestedAmount = loan.get("amount");
    const memberId = loan.get("member_id");

    // Get guarantor's savings and deduct collateral
    const guarantorSavings = $app.findRecordsByFilter("savings", "member_id = '" + guarantorId + "'", { limit: 1 });
    if (guarantorSavings.length === 0) {
      console.log("Error: Guarantor has no savings record during acknowledgment");
      e.next();
      return;
    }

    const availableSavings = guarantorSavings[0].get("total_savings") || 0;

    // Double-check sufficient savings (should have been checked during offer)
    if (collateralAmount > availableSavings) {
      console.log("Error: Insufficient savings during acknowledgment for guarantor " + guarantorId);
      e.next();
      return;
    }

    // Deduct collateral from guarantor's savings
    guarantorSavings[0].set("total_savings", availableSavings - collateralAmount);
    $app.save(guarantorSavings[0]);

    // Create collateral deduction history
    const collateralHistory = new Record("contributions_history");
    collateralHistory.set("member_id", guarantorId);
    collateralHistory.set("group_id", loan.get("group_id"));
    collateralHistory.set("type", "collateral_deduction");
    collateralHistory.set("amount", collateralAmount);
    collateralHistory.set("date", new Date().toISOString());
    collateralHistory.set("description", `Collateral for GIL loan ${loanId}`);
    collateralHistory.set("balance", availableSavings - collateralAmount);
    $app.save(collateralHistory);

    // Notify guarantor of collateral deduction
    const deductionNotification = new Record("notifications");
    deductionNotification.set("member_id", guarantorId);
    deductionNotification.set("type", "collateral_deducted");
    deductionNotification.set("title", "Collateral Deducted");
    deductionNotification.set("message", `KES ${collateralAmount.toLocaleString()} has been deducted from your savings as collateral for the GIL loan. This amount will be returned when the loan is fully repaid.`);
    deductionNotification.set("read_status", false);
    $app.save(deductionNotification);

    // Check if all guarantors have acknowledged and loan is ready for admin review
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

    // Get borrower savings
    const borrowerSavings = $app.findRecordsByFilter("savings", "member_id = '" + memberId + "'", { limit: 1 });
    let borrowerSavingsAmount = 0;
    if (borrowerSavings.length > 0) {
      borrowerSavingsAmount = borrowerSavings[0].get("total_savings") || 0;
    }

    // Calculate required amount: loan + 2% interest
    const requiredAmount = requestedAmount * 1.02;

    if (allAcknowledged && totalAcknowledgedCollateral + borrowerSavingsAmount >= requiredAmount) {
      // All guarantors acknowledged and sufficient collateral - loan is ready for admin disbursement
      loan.set("status", "ready_for_disbursement");
      loan.set("interest_rate", 0.02); // 2% flat rate
      loan.set("repayment_period_months", 3); // 3 months repayment
      loan.set("grace_period_months", 1); // 1 month grace period
      $app.save(loan);

      // Notify borrower that loan is ready for admin disbursement
      const disbursementReadyNotification = new Record("notifications");
      disbursementReadyNotification.set("member_id", memberId);
      disbursementReadyNotification.set("type", "loan_ready_for_disbursement");
      disbursementReadyNotification.set("title", "Loan Ready for Disbursement");
      disbursementReadyNotification.set("message", `All guarantors have acknowledged their collateral commitments. Your GIL loan is now awaiting admin approval for disbursement.`);
      disbursementReadyNotification.set("read_status", false);
      $app.save(disbursementReadyNotification);

      // Notify admin about loan ready for disbursement
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
    }

  } catch (err) {
    console.log("Error in guarantor acknowledgment automation: " + err.message);
  }

  e.next();
}, "loan_guarantors");