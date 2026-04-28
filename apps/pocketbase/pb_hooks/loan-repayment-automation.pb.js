/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  // Comprehensive loan repayment automation with new rules
  const repaymentRecord = e.record;
  const loanId = repaymentRecord.get("loan_id");
  const memberId = repaymentRecord.get("member_id");
  const amount = repaymentRecord.get("amount");

  if (!loanId || !memberId || !amount) {
    e.next();
    return;
  }

  try {
    // 1. Get the loan details
    const loan = $app.findRecordById("loans", loanId);
    if (!loan) {
      e.next();
      return;
    }

    const currentBalance = loan.get("balance") || 0;
    const newBalance = currentBalance - amount;
    const loanType = loan.get("loan_type");

    // 2. Update loan balance
    loan.set("balance", newBalance);
    loan.set("last_payment_date", new Date().toISOString());

    // 3. Check if loan is fully repaid
    if (newBalance <= 0) {
      loan.set("status", "repaid");
      loan.set("repayment_date", new Date().toISOString());
      $app.save(loan);

      // Handle full repayment - return collateral for GIL loans
      if (loanType === "GIL") {
        const guarantors = $app.findRecordsByFilter("loan_guarantors", "loan_id = '" + loanId + "' && status = 'active'", { limit: 1000 });

        guarantors.forEach((guarantor) => {
          const guarantorId = guarantor.get("guarantor_id");
          const collateralAmount = guarantor.get("collateral_amount") || 0;

          // Return collateral to guarantor
          const guarantorSavings = $app.findRecordsByFilter("savings", "member_id = '" + guarantorId + "'", { limit: 1 });
          if (guarantorSavings.length > 0) {
            const currentSavings = guarantorSavings[0].get("total_savings") || 0;
            guarantorSavings[0].set("total_savings", currentSavings + collateralAmount);
            $app.save(guarantorSavings[0]);

            // Create collateral return history
            const returnHistory = new Record("contributions_history");
            returnHistory.set("member_id", guarantorId);
            returnHistory.set("group_id", loan.get("group_id"));
            returnHistory.set("type", "collateral_return");
            returnHistory.set("amount", collateralAmount);
            returnHistory.set("date", new Date().toISOString());
            returnHistory.set("description", `Collateral return for repaid GIL loan ${loanId}`);
            returnHistory.set("balance", currentSavings + collateralAmount);
            $app.save(returnHistory);

            // Update guarantor status
            guarantor.set("status", "completed");
            $app.save(guarantor);

            // Notify guarantor
            const returnNotification = new Record("notifications");
            returnNotification.set("member_id", guarantorId);
            returnNotification.set("type", "collateral_returned");
            returnNotification.set("title", "Collateral Returned");
            returnNotification.set("message", `Your collateral of KES ${collateralAmount.toLocaleString()} has been returned as the GIL loan has been fully repaid.`);
            returnNotification.set("read_status", false);
            $app.save(returnNotification);
          }
        });
      }

      // Notify member about full repayment
      const fullRepaymentNotification = new Record("notifications");
      fullRepaymentNotification.set("member_id", memberId);
      fullRepaymentNotification.set("type", "repayment");
      fullRepaymentNotification.set("title", "Loan Fully Repaid");
      fullRepaymentNotification.set("message", `Congratulations! Your ${loanType} loan has been fully repaid. Thank you for your payments.`);
      fullRepaymentNotification.set("read_status", false);
      $app.save(fullRepaymentNotification);

    } else {
      $app.save(loan);

      // Notify member about partial repayment
      const partialNotification = new Record("notifications");
      partialNotification.set("member_id", memberId);
      partialNotification.set("type", "repayment");
      partialNotification.set("title", "Repayment Received");
      partialNotification.set("message", `Your repayment of KES ${amount.toLocaleString()} has been received. Remaining balance: KES ${newBalance.toLocaleString()}`);
      partialNotification.set("read_status", false);
      $app.save(partialNotification);
    }

    // 4. Create repayment history record
    const repaymentHistory = new Record("contributions_history");
    repaymentHistory.set("member_id", memberId);
    repaymentHistory.set("group_id", loan.get("group_id"));
    repaymentHistory.set("type", "loan_repayment");
    repaymentHistory.set("amount", amount);
    repaymentHistory.set("date", new Date().toISOString());
    repaymentHistory.set("description", "Loan Repayment");
    repaymentHistory.set("balance", newBalance);
    $app.save(repaymentHistory);

  } catch (err) {
    console.log("Error in loan repayment automation: " + err.message);
  }

  e.next();
}, "loan_repayments");