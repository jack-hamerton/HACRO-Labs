

onRecordAfterCreateSuccess((e) => {
  

  const repaymentRecord = e.record;
  const loanId = repaymentRecord.get("loan_id");
  const memberId = repaymentRecord.get("member_id");
  const amount = repaymentRecord.get("amount");

  if (!loanId || !memberId || !amount) {
    e.next();
    return;
  }

  try {
    

    const loan = $app.findRecordById("loans", loanId);
    if (!loan) {
      e.next();
      return;
    }

    const currentBalance = loan.get("balance") || 0;
    const newBalance = currentBalance - amount;
    const loanType = loan.get("loan_type");

    

    loan.set("balance", newBalance);
    loan.set("last_payment_date", new Date().toISOString());

    

    if (newBalance <= 0) {
      loan.set("status", "repaid");
      loan.set("repayment_date", new Date().toISOString());
      $app.save(loan);

      const loanType = loan.get("loan_type");
      const loanAmount = Number(loan.get("amount") || 0);
      const interestRate = Number(loan.get("interest_rate") || 0.02);
      const interestAmount = Math.round((loanAmount * interestRate) * 100) / 100;

      if (loanType === "GIL" && interestAmount > 0) {
        const companyShare = interestAmount * 0.5;
        const groupBonus = interestAmount * 0.25;
        const guarantorBonus = interestAmount * 0.25;

        const groupMembers = $app.findRecordsByFilter("group_members", "group_id = '" + loan.get("group_id") + "'", { limit: 1000 });
        const groupMemberCount = groupMembers.length;
        const guarantors = $app.findRecordsByFilter("loan_guarantors", "loan_id = '" + loanId + "' && status = 'approved'", { limit: 1000 });
        const guarantorCount = guarantors.length;

        if (groupMemberCount > 0) {
          const bonusPerGroupMember = groupBonus / groupMemberCount;
          groupMembers.forEach((gm) => {
            const memberSavings = $app.findRecordsByFilter("savings", "member_id = '" + gm.get("member_id") + "'", { limit: 1 });
            if (memberSavings.length > 0) {
              const currentSavings = memberSavings[0].get("total_savings") || 0;
              memberSavings[0].set("total_savings", currentSavings + bonusPerGroupMember);
              $app.save(memberSavings[0]);

              const bonusHistory = new Record("contributions_history");
              bonusHistory.set("member_id", gm.get("member_id"));
              bonusHistory.set("group_id", loan.get("group_id"));
              bonusHistory.set("type", "group_bonus");
              bonusHistory.set("amount", bonusPerGroupMember);
              bonusHistory.set("date", new Date().toISOString());
              bonusHistory.set("description", `Group bonus from fully repaid GIL loan ${loanId}`);
              bonusHistory.set("balance", currentSavings + bonusPerGroupMember);
              $app.save(bonusHistory);
            }
          });
        }

        if (guarantorCount > 0) {
          const bonusPerGuarantor = guarantorBonus / guarantorCount;
          guarantors.forEach((guarantor) => {
            const guarantorId = guarantor.get("guarantor_id");
            const guarantorSavings = $app.findRecordsByFilter("savings", "member_id = '" + guarantorId + "'", { limit: 1 });
            if (guarantorSavings.length > 0) {
              const currentSavings = guarantorSavings[0].get("total_savings") || 0;
              guarantorSavings[0].set("total_savings", currentSavings + bonusPerGuarantor);
              $app.save(guarantorSavings[0]);

              const bonusHistory = new Record("contributions_history");
              bonusHistory.set("member_id", guarantorId);
              bonusHistory.set("group_id", loan.get("group_id"));
              bonusHistory.set("type", "guarantor_bonus");
              bonusHistory.set("amount", bonusPerGuarantor);
              bonusHistory.set("date", new Date().toISOString());
              bonusHistory.set("description", `Guarantor bonus from fully repaid GIL loan ${loanId}`);
              bonusHistory.set("balance", currentSavings + bonusPerGuarantor);
              $app.save(bonusHistory);
            }
          });
        }

        console.log(`Interest distribution for fully repaid GIL loan ${loanId}: company=${companyShare}, group=${groupBonus}, guarantors=${guarantorBonus}`);
      }

      

      if (loanType === "GIL") {
        const guarantors = $app.findRecordsByFilter("loan_guarantors", "loan_id = '" + loanId + "' && status = 'active'", { limit: 1000 });

        guarantors.forEach((guarantor) => {
          const guarantorId = guarantor.get("guarantor_id");
          const collateralAmount = guarantor.get("collateral_amount") || 0;

          

          const guarantorSavings = $app.findRecordsByFilter("savings", "member_id = '" + guarantorId + "'", { limit: 1 });
          if (guarantorSavings.length > 0) {
            const currentSavings = guarantorSavings[0].get("total_savings") || 0;
            guarantorSavings[0].set("total_savings", currentSavings + collateralAmount);
            $app.save(guarantorSavings[0]);

            

            const returnHistory = new Record("contributions_history");
            returnHistory.set("member_id", guarantorId);
            returnHistory.set("group_id", loan.get("group_id"));
            returnHistory.set("type", "collateral_return");
            returnHistory.set("amount", collateralAmount);
            returnHistory.set("date", new Date().toISOString());
            returnHistory.set("description", `Collateral return for repaid GIL loan ${loanId}`);
            returnHistory.set("balance", currentSavings + collateralAmount);
            $app.save(returnHistory);

            

            guarantor.set("status", "completed");
            $app.save(guarantor);

            

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

      

      const fullRepaymentNotification = new Record("notifications");
      fullRepaymentNotification.set("member_id", memberId);
      fullRepaymentNotification.set("type", "repayment");
      fullRepaymentNotification.set("title", "Loan Fully Repaid");
      fullRepaymentNotification.set("message", `Congratulations! Your ${loanType} loan has been fully repaid. Thank you for your payments.`);
      fullRepaymentNotification.set("read_status", false);
      $app.save(fullRepaymentNotification);

    } else {
      $app.save(loan);

      

      const partialNotification = new Record("notifications");
      partialNotification.set("member_id", memberId);
      partialNotification.set("type", "repayment");
      partialNotification.set("title", "Repayment Received");
      partialNotification.set("message", `Your repayment of KES ${amount.toLocaleString()} has been received. Remaining balance: KES ${newBalance.toLocaleString()}`);
      partialNotification.set("read_status", false);
      $app.save(partialNotification);
    }

    

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