/// <reference path="../pb_data/types.d.ts" />
/// <reference path="../pb_data/types.d.ts" />
cronAdd("check_overdue_loans", "0 9 * * *", () => {
  // Daily check for overdue loans with new grace period and default rules
  console.log("Running daily overdue loan check...");

  try {
    const today = new Date();

    // Find all active loans
    const activeLoans = $app.findRecordsByFilter("loans", "status = 'active'", { limit: 10000 });

    activeLoans.forEach((loan) => {
      const loanId = loan.id;
      const memberId = loan.get("member_id");
      const loanType = loan.get("loan_type");
      const disbursementDate = loan.get("disbursement_date");
      const lastPaymentDate = loan.get("last_payment_date");
      const loanBalance = loan.get("balance") || 0;

      if (!disbursementDate) {
        return; // Loan not disbursed yet
      }

      const disbursementDateObj = new Date(disbursementDate);
      const daysSinceDisbursement = Math.floor((today - disbursementDateObj) / (1000 * 60 * 60 * 24));

      // Skip if within 1 month grace period (30 days)
      if (daysSinceDisbursement <= 30) {
        return;
      }

      // Check if loan is overdue (more than 30 days since disbursement)
      let isOverdue = false;
      let daysOverdue = 0;

      if (!lastPaymentDate) {
        // No payments made
        daysOverdue = daysSinceDisbursement - 30; // Subtract grace period
        isOverdue = daysOverdue > 0;
      } else {
        // Check last payment
        const lastPaymentDateObj = new Date(lastPaymentDate);
        daysOverdue = Math.floor((today - lastPaymentDateObj) / (1000 * 60 * 60 * 24));
        isOverdue = daysOverdue > 30; // More than 30 days since last payment
      }

      if (isOverdue) {
        // Check if we've already notified the group
        const existingNotifications = $app.findRecordsByFilter(
          "notifications",
          "member_id = '" + memberId + "' && type = 'loan_overdue' && created_date >= '" + disbursementDate + "'",
          { limit: 1000 }
        );

        const notificationDays = existingNotifications.length;

        if (notificationDays < 60) { // Notify for up to 60 days (2 months)
          // Send overdue notification to group
          const groupId = loan.get("group_id");
          const groupMembers = $app.findRecordsByFilter("group_members", "group_id = '" + groupId + "'", { limit: 1000 });

          groupMembers.forEach((gm) => {
            const gmMemberId = gm.get("member_id");

            // Skip the borrower
            if (gmMemberId === memberId) {
              return;
            }

            const overdueNotification = new Record("notifications");
            overdueNotification.set("member_id", gmMemberId);
            overdueNotification.set("type", "loan_overdue");
            overdueNotification.set("title", "Overdue Loan Notice");
            overdueNotification.set("message", `A ${loanType} loan of KES ${loanBalance.toLocaleString()} is ${daysOverdue} days overdue. The member has been notified for ${notificationDays + 1} days.`);
            overdueNotification.set("read_status", false);
            $app.save(overdueNotification);
          });

          // Also notify the borrower
          const borrowerNotification = new Record("notifications");
          borrowerNotification.set("member_id", memberId);
          borrowerNotification.set("type", "loan_overdue");
          borrowerNotification.set("title", "Loan Overdue Notice");
          borrowerNotification.set("message", `Your ${loanType} loan is ${daysOverdue} days overdue. Please make payment immediately to avoid default. Group has been notified for ${notificationDays + 1} days.`);
          borrowerNotification.set("read_status", false);
          $app.save(borrowerNotification);

        } else {
          // After 60 days of notifications, apply default penalties
          handleLoanDefault(loan, memberId, loanBalance, loanType);
        }
      }
    });

  } catch (err) {
    console.log("Error in overdue loan check: " + err.message);
  }
});

function handleLoanDefault(loan, memberId, loanBalance, loanType) {
  try {
    console.log(`Processing default for loan ${loan.id}, member ${memberId}, balance ${loanBalance}`);

    if (loanType === "IL") {
      // For IL loans, take from member's savings and bonuses
      const memberSavings = $app.findRecordsByFilter("savings", "member_id = '" + memberId + "'", { limit: 1 });
      let availableSavings = 0;
      if (memberSavings.length > 0) {
        availableSavings = memberSavings[0].get("total_savings") || 0;
      }

      // Calculate bonuses
      const bonusesEarned = $app.findRecordsByFilter("contributions_history",
        "member_id = '" + memberId + "' && type = 'interest_earned'", { limit: 1000 });
      let totalBonuses = 0;
      bonusesEarned.forEach(bonus => {
        totalBonuses += bonus.get("amount") || 0;
      });

      const totalAvailable = availableSavings + totalBonuses;
      const amountToRecover = Math.min(loanBalance, totalAvailable);

      // Deduct from savings first
      if (availableSavings >= amountToRecover) {
        memberSavings[0].set("total_savings", availableSavings - amountToRecover);
        $app.save(memberSavings[0]);
      } else {
        // Use all savings and remaining from bonuses (conceptually)
        memberSavings[0].set("total_savings", 0);
        $app.save(memberSavings[0]);
        // Note: Bonuses would be handled separately in a real system
      }

      // Create default recovery record
      const defaultHistory = new Record("contributions_history");
      defaultHistory.set("member_id", memberId);
      defaultHistory.set("group_id", loan.get("group_id"));
      defaultHistory.set("type", "loan_default_recovery");
      defaultHistory.set("amount", amountToRecover);
      defaultHistory.set("date", new Date().toISOString());
      defaultHistory.set("description", `Default recovery for IL loan ${loan.id}`);
      defaultHistory.set("balance", availableSavings - amountToRecover);
      $app.save(defaultHistory);

      // Update loan status
      loan.set("status", "defaulted");
      loan.set("balance", loanBalance - amountToRecover);
      $app.save(loan);

      // Notify member
      const defaultNotification = new Record("notifications");
      defaultNotification.set("member_id", memberId);
      defaultNotification.set("type", "loan_default");
      defaultNotification.set("title", "Loan Default Processed");
      defaultNotification.set("message", `Your IL loan has defaulted. KES ${amountToRecover.toLocaleString()} has been recovered from your savings. Remaining balance: KES ${(loanBalance - amountToRecover).toLocaleString()}`);
      defaultNotification.set("read_status", false);
      $app.save(defaultNotification);

    } else if (loanType === "GIL") {
      // For GIL loans, distribute remaining balance to guarantors
      const guarantors = $app.findRecordsByFilter("loan_guarantors", "loan_id = '" + loan.id + "' && status = 'active'", { limit: 1000 });

      if (guarantors.length > 0) {
        const amountPerGuarantor = loanBalance / guarantors.length;

        guarantors.forEach((guarantor) => {
          const guarantorId = guarantor.get("guarantor_id");
          const collateralAmount = guarantor.get("collateral_amount") || 0;

          // Calculate how much to deduct from this guarantor's collateral
          const deductionAmount = Math.min(amountPerGuarantor, collateralAmount);

          // Update guarantor collateral
          guarantor.set("collateral_amount", collateralAmount - deductionAmount);
          guarantor.set("status", "default_penalty");
          $app.save(guarantor);

          // Return remaining collateral to guarantor
          const remainingCollateral = collateralAmount - deductionAmount;
          if (remainingCollateral > 0) {
            const guarantorSavings = $app.findRecordsByFilter("savings", "member_id = '" + guarantorId + "'", { limit: 1 });
            if (guarantorSavings.length > 0) {
              const currentSavings = guarantorSavings[0].get("total_savings") || 0;
              guarantorSavings[0].set("total_savings", currentSavings + remainingCollateral);
              $app.save(guarantorSavings[0]);

              // Create return history
              const returnHistory = new Record("contributions_history");
              returnHistory.set("member_id", guarantorId);
              returnHistory.set("group_id", loan.get("group_id"));
              returnHistory.set("type", "collateral_partial_return");
              returnHistory.set("amount", remainingCollateral);
              returnHistory.set("date", new Date().toISOString());
              returnHistory.set("description", `Partial collateral return after default for GIL loan ${loan.id}`);
              returnHistory.set("balance", currentSavings + remainingCollateral);
              $app.save(returnHistory);
            }
          }

          // Notify guarantor
          const guarantorNotification = new Record("notifications");
          guarantorNotification.set("member_id", guarantorId);
          guarantorNotification.set("type", "guarantor_penalty");
          guarantorNotification.set("title", "Guarantor Penalty Applied");
          guarantorNotification.set("message", `KES ${deductionAmount.toLocaleString()} has been deducted from your collateral for defaulted GIL loan. Remaining collateral: KES ${remainingCollateral.toLocaleString()}`);
          guarantorNotification.set("read_status", false);
          $app.save(guarantorNotification);
        });

        // Mark loan as defaulted
        loan.set("status", "defaulted");
        loan.set("balance", 0);
        $app.save(loan);

        // Notify borrower
        const defaultNotification = new Record("notifications");
        defaultNotification.set("member_id", memberId);
        defaultNotification.set("type", "loan_default");
        defaultNotification.set("title", "GIL Loan Defaulted");
        defaultNotification.set("message", `Your GIL loan has defaulted. The remaining balance has been distributed among your guarantors as penalties.`);
        defaultNotification.set("read_status", false);
        $app.save(defaultNotification);
      }
    }

  } catch (err) {
    console.log("Error handling loan default: " + err.message);
  }
}

cronAdd("monthly_interest_distribution", "0 10 1 * *", () => {
  // Monthly interest distribution on the 1st of each month at 10 AM
  console.log("Running monthly interest distribution...");

  try {
    // Get all savings records
    const allSavings = $app.findRecordsByFilter("savings", "", { limit: 10000 });

    let totalSavings = 0;
    let totalInterest = 0;

    allSavings.forEach((savings) => {
      totalSavings += savings.get("total_savings") || 0;
    });

    // Calculate total interest earned (assume 8% annual interest)
    const monthlyInterestRate = 0.08 / 12;
    totalInterest = totalSavings * monthlyInterestRate;

    if (totalInterest > 0 && totalSavings > 0) {
      // Distribute interest proportionally to savers
      allSavings.forEach((savings) => {
        const memberSavings = savings.get("total_savings") || 0;
        const memberInterest = (memberSavings / totalSavings) * totalInterest;

        if (memberInterest > 0) {
          // Update savings balance
          savings.set("total_savings", memberSavings + memberInterest);
          $app.save(savings);

          // Create interest history record
          const interestHistory = new Record("contributions_history");
          interestHistory.set("member_id", savings.get("member_id"));
          interestHistory.set("group_id", savings.get("group_id"));
          interestHistory.set("type", "interest_earned");
          interestHistory.set("amount", memberInterest);
          interestHistory.set("date", new Date().toISOString());
          interestHistory.set("description", "Monthly Interest Distribution");
          interestHistory.set("balance", memberSavings + memberInterest);
          $app.save(interestHistory);

          // Notify member about interest earned
          const interestNotification = new Record("notifications");
          interestNotification.set("member_id", savings.get("member_id"));
          interestNotification.set("type", "interest");
          interestNotification.set("title", "Interest Earned");
          interestNotification.set("message", `You have earned KES ${memberInterest.toFixed(2)} in interest this month. Total savings: KES ${(memberSavings + memberInterest).toFixed(2)}`);
          interestNotification.set("read_status", false);
          $app.save(interestNotification);
        }
      });

      console.log(`Distributed total interest of ${totalInterest.toFixed(2)} across ${allSavings.length} savers`);
    }

  } catch (err) {
    console.log("Error in monthly interest distribution: " + err.message);
  }
});