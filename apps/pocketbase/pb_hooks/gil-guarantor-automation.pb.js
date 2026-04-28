/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  // GIL guarantor and collateral automation with acknowledgment requirement
  const guarantorRecord = e.record;
  const loanId = guarantorRecord.get("loan_id");
  const guarantorId = guarantorRecord.get("guarantor_id");
  const collateralAmount = guarantorRecord.get("collateral_amount");

  if (!loanId || !guarantorId || !collateralAmount) {
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

    // Check if guarantor has sufficient savings
    const guarantorSavings = $app.findRecordsByFilter("savings", "member_id = '" + guarantorId + "'", { limit: 1 });
    if (guarantorSavings.length === 0) {
      // Reject guarantor - no savings record
      guarantorRecord.set("status", "rejected");
      $app.save(guarantorRecord);

      const rejectionNotification = new Record("notifications");
      rejectionNotification.set("member_id", guarantorId);
      rejectionNotification.set("type", "guarantor_rejection");
      rejectionNotification.set("title", "Guarantor Application Rejected");
      rejectionNotification.set("message", "You cannot be a guarantor as you have no savings record.");
      rejectionNotification.set("read_status", false);
      $app.save(rejectionNotification);

      e.next();
      return;
    }

    const availableSavings = guarantorSavings[0].get("total_savings") || 0;

    if (collateralAmount > availableSavings) {
      // Reject guarantor - insufficient savings
      guarantorRecord.set("status", "rejected");
      $app.save(guarantorRecord);

      const rejectionNotification = new Record("notifications");
      rejectionNotification.set("member_id", guarantorId);
      rejectionNotification.set("type", "guarantor_rejection");
      rejectionNotification.set("title", "Guarantor Application Rejected");
      rejectionNotification.set("message", `Insufficient savings. You offered KES ${collateralAmount.toLocaleString()} but only have KES ${availableSavings.toLocaleString()} available.`);
      rejectionNotification.set("read_status", false);
      $app.save(rejectionNotification);

      e.next();
      return;
    }

    // Set guarantor as pending acknowledgment - collateral not deducted yet
    guarantorRecord.set("status", "pending_acknowledgment");
    $app.save(guarantorRecord);

    // Notify guarantor to acknowledge collateral commitment
    const acknowledgmentNotification = new Record("notifications");
    acknowledgmentNotification.set("member_id", guarantorId);
    acknowledgmentNotification.set("type", "guarantor_acknowledgment_required");
    acknowledgmentNotification.set("title", "Collateral Acknowledgment Required");
    acknowledgmentNotification.set("message", `You have been selected as a guarantor for a GIL loan of KES ${requestedAmount.toLocaleString()}. Please acknowledge your commitment to provide KES ${collateralAmount.toLocaleString()} as collateral. This amount will be deducted from your savings when the loan is disbursed.`);
    acknowledgmentNotification.set("read_status", false);
    $app.save(acknowledgmentNotification);

    // Check if total offered collateral meets loan requirements (but don't approve yet)
    const allGuarantors = $app.findRecordsByFilter("loan_guarantors", "loan_id = '" + loanId + "'", { limit: 1000 });

    let totalOfferedCollateral = 0;
    allGuarantors.forEach(g => {
      if (g.get("status") !== "rejected") {
        totalOfferedCollateral += g.get("collateral_amount") || 0;
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

    if (totalOfferedCollateral + borrowerSavingsAmount >= requiredAmount) {
      // Sufficient collateral offered - notify borrower that loan is ready for admin review
      loan.set("status", "ready_for_admin_review");
      $app.save(loan);

      const readyNotification = new Record("notifications");
      readyNotification.set("member_id", memberId);
      readyNotification.set("type", "loan_ready_for_review");
      readyNotification.set("title", "Loan Ready for Admin Review");
      readyNotification.set("message", `Your GIL loan application has sufficient collateral offers and is now awaiting admin approval for disbursement.`);
      readyNotification.set("read_status", false);
      $app.save(readyNotification);

      // Notify admin about loan ready for review
      const adminUsers = $app.findRecordsByFilter("admins", "role != 'super_admin'", { limit: 100 });
      adminUsers.forEach(admin => {
        const adminNotification = new Record("notifications");
        adminNotification.set("member_id", admin.id); // Assuming admins can receive notifications
        adminNotification.set("type", "admin_loan_review");
        adminNotification.set("title", "Loan Ready for Review");
        adminNotification.set("message", `A GIL loan application for KES ${requestedAmount.toLocaleString()} is ready for your review and disbursement.`);
        adminNotification.set("read_status", false);
        $app.save(adminNotification);
      });
    } else {
      // Notify borrower of progress
      const progressAmount = totalOfferedCollateral + borrowerSavingsAmount;
      const remainingAmount = requiredAmount - progressAmount;

      const progressNotification = new Record("notifications");
      progressNotification.set("member_id", memberId);
      progressNotification.set("type", "collateral_progress");
      progressNotification.set("title", "GIL Collateral Progress");
      progressNotification.set("message", `Collateral offered: KES ${progressAmount.toLocaleString()} / KES ${requiredAmount.toLocaleString()}. Need KES ${remainingAmount.toLocaleString()} more from additional guarantors.`);
      progressNotification.set("read_status", false);
      $app.save(progressNotification);
    }

  } catch (err) {
    console.log("Error in GIL guarantor automation: " + err.message);
  }

  e.next();
}, "loan_guarantors");