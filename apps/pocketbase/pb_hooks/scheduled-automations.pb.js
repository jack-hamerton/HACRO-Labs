cronAdd("check_overdue_loans", "0 9 * * *", () => {
  

  console.log("Running daily overdue loan check...");

  try {
    const today = new Date();

    

    const activeLoans = $app.findRecordsByFilter("loans", "status = 'active'", { limit: 10000 });

    activeLoans.forEach((loan) => {
      const loanId = loan.id;
      const memberId = loan.get("member_id");
      const loanType = loan.get("loan_type");
      const disbursementDate = loan.get("disbursement_date");
      const lastPaymentDate = loan.get("last_payment_date");
      const loanBalance = loan.get("balance") || 0;

      if (!disbursementDate) {
        return; 

      }

      const disbursementDateObj = new Date(disbursementDate);
      const daysSinceDisbursement = Math.floor((today - disbursementDateObj) / (1000 * 60 * 60 * 24));

      

      if (daysSinceDisbursement <= 30) {
        return;
      }

      

      let isOverdue = false;
      let daysOverdue = 0;

      if (!lastPaymentDate) {
        

        daysOverdue = daysSinceDisbursement - 30; 

        isOverdue = daysOverdue > 0;
      } else {
        

        const lastPaymentDateObj = new Date(lastPaymentDate);
        daysOverdue = Math.floor((today - lastPaymentDateObj) / (1000 * 60 * 60 * 24));
        isOverdue = daysOverdue > 30; 

      }

      if (isOverdue) {
        

        const existingNotifications = $app.findRecordsByFilter(
          "notifications",
          "member_id = '" + memberId + "' && type = 'loan_overdue' && created_date >= '" + disbursementDate + "'",
          { limit: 1000 }
        );

        const notificationDays = existingNotifications.length;

        if (notificationDays < 60) { 

          

          const groupId = loan.get("group_id");
          const groupMembers = $app.findRecordsByFilter("group_members", "group_id = '" + groupId + "'", { limit: 1000 });

          groupMembers.forEach((gm) => {
            const gmMemberId = gm.get("member_id");

            

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

          

          const borrowerNotification = new Record("notifications");
          borrowerNotification.set("member_id", memberId);
          borrowerNotification.set("type", "loan_overdue");
          borrowerNotification.set("title", "Loan Overdue Notice");
          borrowerNotification.set("message", `Your ${loanType} loan is ${daysOverdue} days overdue. Please make payment immediately to avoid default. Group has been notified for ${notificationDays + 1} days.`);
          borrowerNotification.set("read_status", false);
          $app.save(borrowerNotification);

        } else {
          

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
      

      const memberSavings = $app.findRecordsByFilter("savings", "member_id = '" + memberId + "'", { limit: 1 });
      let availableSavings = 0;
      if (memberSavings.length > 0) {
        availableSavings = memberSavings[0].get("total_savings") || 0;
      }

      

      const bonusesEarned = $app.findRecordsByFilter("contributions_history",
        "member_id = '" + memberId + "' && type = 'interest_earned'", { limit: 1000 });
      let totalBonuses = 0;
      bonusesEarned.forEach(bonus => {
        totalBonuses += bonus.get("amount") || 0;
      });

      const totalAvailable = availableSavings + totalBonuses;
      const amountToRecover = Math.min(loanBalance, totalAvailable);

      

      if (availableSavings >= amountToRecover) {
        memberSavings[0].set("total_savings", availableSavings - amountToRecover);
        $app.save(memberSavings[0]);
      } else {
        

        memberSavings[0].set("total_savings", 0);
        $app.save(memberSavings[0]);
        

      }

      const remainingBalanceAfterRecovery = loanBalance - amountToRecover;
      const remainingBalanceAfterGroupPenalty = remainingBalanceAfterRecovery > 0
        ? deductGroupInterestPenalty(loan, remainingBalanceAfterRecovery, memberId)
        : 0;

      

      const defaultHistory = new Record("contributions_history");
      defaultHistory.set("member_id", memberId);
      defaultHistory.set("group_id", loan.get("group_id"));
      defaultHistory.set("type", "loan_default_recovery");
      defaultHistory.set("amount", amountToRecover);
      defaultHistory.set("date", new Date().toISOString());
      defaultHistory.set("description", `Default recovery for IL loan ${loan.id}`);
      defaultHistory.set("balance", availableSavings - amountToRecover);
      $app.save(defaultHistory);

      

      loan.set("status", "defaulted");
      loan.set("balance", Math.max(0, remainingBalanceAfterGroupPenalty));
      $app.save(loan);

      

      const defaultNotification = new Record("notifications");
      defaultNotification.set("member_id", memberId);
      defaultNotification.set("type", "loan_default");
      defaultNotification.set("title", "Loan Default Processed");
      let defaultMessage = `Your IL loan has defaulted. KES ${amountToRecover.toLocaleString()} has been recovered from your savings.`;
      if (remainingBalanceAfterRecovery > 0 && remainingBalanceAfterGroupPenalty === 0) {
        defaultMessage += ` The remaining KES ${remainingBalanceAfterRecovery.toLocaleString()} was covered by group interest deductions from your group.`;
      } else {
        defaultMessage += ` Remaining balance: KES ${Math.max(0, remainingBalanceAfterGroupPenalty).toLocaleString()}`;
      }
      defaultNotification.set("message", defaultMessage);
      defaultNotification.set("read_status", false);
      $app.save(defaultNotification);

    } else if (loanType === "GIL") {
      

      const borrowerSavingsRecords = $app.findRecordsByFilter("savings", "member_id = '" + memberId + "'", { limit: 1 });
      let borrowerSavings = 0;
      if (borrowerSavingsRecords.length > 0) {
        borrowerSavings = borrowerSavingsRecords[0].get("total_savings") || 0;
      }

      const amountFromBorrower = Math.min(loanBalance, borrowerSavings);
      if (amountFromBorrower > 0 && borrowerSavingsRecords.length > 0) {
        borrowerSavingsRecords[0].set("total_savings", borrowerSavings - amountFromBorrower);
        $app.save(borrowerSavingsRecords[0]);

        const borrowerRecoveryHistory = new Record("contributions_history");
        borrowerRecoveryHistory.set("member_id", memberId);
        borrowerRecoveryHistory.set("group_id", loan.get("group_id"));
        borrowerRecoveryHistory.set("type", "loan_default_recovery");
        borrowerRecoveryHistory.set("amount", amountFromBorrower);
        borrowerRecoveryHistory.set("date", new Date().toISOString());
        borrowerRecoveryHistory.set("description", `Borrower savings recovered for defaulted GIL loan ${loan.id}`);
        borrowerRecoveryHistory.set("balance", borrowerSavings - amountFromBorrower);
        $app.save(borrowerRecoveryHistory);
      }

      let remainingBalance = loanBalance - amountFromBorrower;
      if (remainingBalance > 0) {
        remainingBalance = deductGroupInterestPenalty(loan, remainingBalance, memberId);
      }

      const guarantors = $app.findRecordsByFilter("loan_guarantors", "loan_id = '" + loan.id + "' && status = 'active'", { limit: 1000 });
      const guarantorCollateralTotal = guarantors.reduce((sum, guarantor) => sum + (guarantor.get("collateral_amount") || 0), 0);

      if (remainingBalance <= 0) {
        loan.set("status", "repaid");
        loan.set("balance", 0);
        $app.save(loan);

        guarantors.forEach((guarantor) => {
          const guarantorId = guarantor.get("guarantor_id");
          const collateralAmount = guarantor.get("collateral_amount") || 0;
          if (collateralAmount > 0) {
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
              returnHistory.set("description", `Collateral returned after defaulted GIL loan ${loan.id}`);
              returnHistory.set("balance", currentSavings + collateralAmount);
              $app.save(returnHistory);
            }
          }
          guarantor.set("collateral_amount", 0);
          guarantor.set("status", "completed");
          $app.save(guarantor);
        });
      } else {
        loan.set("status", "defaulted");
        loan.set("balance", remainingBalance);
        $app.save(loan);
      }

      const defaultNotification = new Record("notifications");
      defaultNotification.set("member_id", memberId);
      defaultNotification.set("type", "loan_default");
      defaultNotification.set("title", "GIL Loan Defaulted");
      if (remainingBalance <= 0) {
        defaultNotification.set("message", `Your GIL loan default has been recovered from your savings and group interest deductions. Guarantor collateral has been returned.`);
      } else {
        defaultNotification.set("message", `Your GIL loan has defaulted. KES ${remainingBalance.toLocaleString()} remains after savings and group interest deductions.`);
      }
      defaultNotification.set("read_status", false);
      $app.save(defaultNotification);
    }

  } catch (err) {
    console.log("Error handling loan default: " + err.message);
  }
}

function deductGroupInterestPenalty(loan, remainingBalance, borrowerId) {
  if (!remainingBalance || remainingBalance <= 0) {
    return 0;
  }

  const groupId = loan.get("group_id");
  if (!groupId) {
    return remainingBalance;
  }

  const groupMembers = $app.findRecordsByFilter("group_members", "group_id = '" + groupId + "'", { limit: 1000 });
  const eligibleMembers = groupMembers.filter((gm) => gm.get("member_id") !== borrowerId);
  if (eligibleMembers.length === 0) {
    return remainingBalance;
  }

  let totalInterest = 0;
  const memberInterest = eligibleMembers.map((gm) => {
    const memberId = gm.get("member_id");
    const interestRecords = $app.findRecordsByFilter("contributions_history", "member_id = '" + memberId + "' && type = 'interest_earned'", { limit: 1000 });
    let interestBalance = 0;
    interestRecords.forEach((record) => {
      interestBalance += record.get("amount") || 0;
    });
    totalInterest += interestBalance;
    return { memberId, interestBalance };
  });

  let remaining = remainingBalance;
  if (totalInterest > 0) {
    memberInterest.forEach((item) => {
      if (remaining <= 0) return;
      const deductionShare = Math.min((item.interestBalance / totalInterest) * remaining, item.interestBalance);
      if (deductionShare <= 0) return;

      const savingsRecords = $app.findRecordsByFilter("savings", "member_id = '" + item.memberId + "'", { limit: 1 });
      if (savingsRecords.length === 0) return;

      const currentSavings = savingsRecords[0].get("total_savings") || 0;
      const deductionAmount = Math.min(deductionShare, currentSavings);
      if (deductionAmount <= 0) return;

      savingsRecords[0].set("total_savings", currentSavings - deductionAmount);
      $app.save(savingsRecords[0]);

      const penaltyHistory = new Record("contributions_history");
      penaltyHistory.set("member_id", item.memberId);
      penaltyHistory.set("group_id", groupId);
      penaltyHistory.set("type", "interest_penalty");
      penaltyHistory.set("amount", deductionAmount);
      penaltyHistory.set("date", new Date().toISOString());
      penaltyHistory.set("description", `Group interest deduction for defaulted loan ${loan.id}`);
      penaltyHistory.set("balance", currentSavings - deductionAmount);
      $app.save(penaltyHistory);

      const penaltyNotification = new Record("notifications");
      penaltyNotification.set("member_id", item.memberId);
      penaltyNotification.set("type", "penalty");
      penaltyNotification.set("title", "Group Interest Penalty");
      penaltyNotification.set("message", `KES ${deductionAmount.toLocaleString()} has been deducted from your savings as group interest penalty to cover a defaulted loan.`);
      penaltyNotification.set("read_status", false);
      $app.save(penaltyNotification);

      remaining -= deductionAmount;
    });
  } else {
    const perMemberShare = remaining / eligibleMembers.length;
    eligibleMembers.forEach((gm) => {
      if (remaining <= 0) return;
      const memberId = gm.get("member_id");
      const savingsRecords = $app.findRecordsByFilter("savings", "member_id = '" + memberId + "'", { limit: 1 });
      if (savingsRecords.length === 0) return;

      const currentSavings = savingsRecords[0].get("total_savings") || 0;
      const deductionAmount = Math.min(perMemberShare, currentSavings);
      if (deductionAmount <= 0) return;

      savingsRecords[0].set("total_savings", currentSavings - deductionAmount);
      $app.save(savingsRecords[0]);

      const penaltyHistory = new Record("contributions_history");
      penaltyHistory.set("member_id", memberId);
      penaltyHistory.set("group_id", groupId);
      penaltyHistory.set("type", "interest_penalty");
      penaltyHistory.set("amount", deductionAmount);
      penaltyHistory.set("date", new Date().toISOString());
      penaltyHistory.set("description", `Group interest deduction for defaulted loan ${loan.id}`);
      penaltyHistory.set("balance", currentSavings - deductionAmount);
      $app.save(penaltyHistory);

      const penaltyNotification = new Record("notifications");
      penaltyNotification.set("member_id", memberId);
      penaltyNotification.set("type", "penalty");
      penaltyNotification.set("title", "Group Interest Penalty");
      penaltyNotification.set("message", `KES ${deductionAmount.toLocaleString()} has been deducted from your savings as group interest penalty to cover a defaulted loan.`);
      penaltyNotification.set("read_status", false);
      $app.save(penaltyNotification);

      remaining -= deductionAmount;
    });
  }

  return remaining;
}

cronAdd("monthly_interest_distribution", "0 10 1 * *", () => {
  

  console.log("Running monthly interest distribution...");

  try {
    

    const allSavings = $app.findRecordsByFilter("savings", "", { limit: 10000 });

    let totalSavings = 0;
    let totalInterest = 0;

    allSavings.forEach((savings) => {
      totalSavings += savings.get("total_savings") || 0;
    });

    

    const monthlyInterestRate = 0.08 / 12;
    totalInterest = totalSavings * monthlyInterestRate;

    if (totalInterest > 0 && totalSavings > 0) {
      

      allSavings.forEach((savings) => {
        const memberSavings = savings.get("total_savings") || 0;
        const memberInterest = (memberSavings / totalSavings) * totalInterest;

        if (memberInterest > 0) {
          

          savings.set("total_savings", memberSavings + memberInterest);
          $app.save(savings);

          

          const interestHistory = new Record("contributions_history");
          interestHistory.set("member_id", savings.get("member_id"));
          interestHistory.set("group_id", savings.get("group_id"));
          interestHistory.set("type", "interest_earned");
          interestHistory.set("amount", memberInterest);
          interestHistory.set("date", new Date().toISOString());
          interestHistory.set("description", "Monthly Interest Distribution");
          interestHistory.set("balance", memberSavings + memberInterest);
          $app.save(interestHistory);

          

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

cronAdd("insurance_fee_deduction", "0 11 1 * *", () => {
  

  console.log("Running monthly insurance fee deduction check...");

  try {
    const today = new Date();
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(today.getMonth() - 12);

    

    const allMembers = $app.findRecordsByFilter("members", "", { limit: 10000 });

    allMembers.forEach((member) => {
      const memberId = member.id;
      const memberName = `${member.get("first_name")} ${member.get("last_name")}`;

      

      const recentInsurancePayments = $app.findRecordsByFilter(
        "payments",
        `member_id = '${memberId}' && payment_type = 'insurance' && payment_status = 'completed' && created >= '${twelveMonthsAgo.toISOString()}'`,
        { limit: 1000 }
      );

      if (recentInsurancePayments.length === 0) {
        

        const memberSavings = $app.findRecordsByFilter("savings", `member_id = '${memberId}'`, { limit: 10000 });
        let totalSavings = 0;

        memberSavings.forEach((saving) => {
          totalSavings += saving.get("amount") || 0;
        });

        

        const insuranceFee = 1800;

        if (totalSavings >= insuranceFee) {
          

          let remainingDeduction = insuranceFee;
          const updatedSavings = [];

          

          memberSavings.sort((a, b) => new Date(a.get("date")) - new Date(b.get("date")));

          for (const saving of memberSavings) {
            if (remainingDeduction <= 0) break;

            const currentAmount = saving.get("amount") || 0;
            const deduction = Math.min(remainingDeduction, currentAmount);

            if (deduction > 0) {
              saving.set("amount", currentAmount - deduction);
              $app.save(saving);
              remainingDeduction -= deduction;

              

              const deductionHistory = new Record("contributions_history");
              deductionHistory.set("member_id", memberId);
              deductionHistory.set("group_id", member.get("group_id"));
              deductionHistory.set("type", "insurance_fee_deduction");
              deductionHistory.set("amount", -deduction);
              deductionHistory.set("date", new Date().toISOString());
              deductionHistory.set("description", "Insurance fee deduction for non-payment over 12 months");
              deductionHistory.set("balance", totalSavings - insuranceFee);
              $app.save(deductionHistory);
            }
          }

          

          const companyTransaction = new Record("company_transactions");
          companyTransaction.set("transaction_type", "insurance_fee_deduction");
          companyTransaction.set("amount", insuranceFee);
          companyTransaction.set("member_id", memberId);
          companyTransaction.set("description", `Insurance fee deduction from savings for ${memberName}`);
          companyTransaction.set("date", new Date().toISOString());
          $app.save(companyTransaction);

          

          const notification = new Record("notifications");
          notification.set("member_id", memberId);
          notification.set("type", "insurance_fee_deduction");
          notification.set("title", "Insurance Fee Deducted from Savings");
          notification.set("message", `KES ${insuranceFee.toLocaleString()} has been deducted from your savings for unpaid insurance fees over the past 12 months. Please ensure timely payments to avoid future deductions.`);
          notification.set("read_status", false);
          $app.save(notification);

          console.log(`Deducted ${insuranceFee} KSH insurance fee from savings of member ${memberId}`);
        } else {
          

          const notification = new Record("notifications");
          notification.set("member_id", memberId);
          notification.set("type", "insurance_fee_overdue");
          notification.set("title", "Insurance Fee Payment Required");
          notification.set("message", `You have not paid insurance fees for the past 12 months. KES ${insuranceFee.toLocaleString()} is due. Please make payment immediately to avoid deductions from your savings.`);
          notification.set("read_status", false);
          $app.save(notification);

          console.log(`Member ${memberId} has unpaid insurance fees but insufficient savings for deduction`);
        }
      }
    });

  } catch (err) {
    console.log("Error in insurance fee deduction check: " + err.message);
  }
});

cronAdd("bonus_deduction_no_loans", "0 12 1 * *", () => {
  

  console.log("Running monthly bonus deduction check for non-loan takers...");

  try {
    const today = new Date();
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(today.getMonth() - 12);

    

    const allMembers = $app.findRecordsByFilter("members", "", { limit: 10000 });

    allMembers.forEach((member) => {
      const memberId = member.id;

      

      const recentLoans = $app.findRecordsByFilter(
        "loans",
        `member_id = '${memberId}' && created >= '${twelveMonthsAgo.toISOString()}'`,
        { limit: 1 }
      );

      if (recentLoans.length === 0) {
        

        const memberBonuses = $app.findRecordsByFilter(
          "contributions_history",
          `member_id = '${memberId}' && type = 'bonus' && created >= '${twelveMonthsAgo.toISOString()}'`,
          { limit: 1000 }
        );

        let totalBonuses = 0;
        memberBonuses.forEach((bonus) => {
          totalBonuses += bonus.get("amount") || 0;
        });

        if (totalBonuses > 0) {
          const deductionAmount = totalBonuses * 0.4; 


          

          const loanTakers = [];
          allMembers.forEach((m) => {
            if (m.id !== memberId) {
              const theirLoans = $app.findRecordsByFilter(
                "loans",
                `member_id = '${m.id}' && created >= '${twelveMonthsAgo.toISOString()}'`,
                { limit: 1 }
              );
              if (theirLoans.length > 0) {
                loanTakers.push(m);
              }
            }
          });

          if (loanTakers.length > 0) {
            const bonusPerLoanTaker = (deductionAmount * 0.5) / loanTakers.length; 

            const companyBonus = deductionAmount * 0.1; 


            

            loanTakers.forEach((loanTaker) => {
              

              const bonusHistory = new Record("contributions_history");
              bonusHistory.set("member_id", loanTaker.id);
              bonusHistory.set("group_id", loanTaker.get("group_id"));
              bonusHistory.set("type", "bonus_redistribution");
              bonusHistory.set("amount", bonusPerLoanTaker);
              bonusHistory.set("date", new Date().toISOString());
              bonusHistory.set("description", "Bonus redistribution from non-loan takers");
              bonusHistory.set("balance", 0); 

              $app.save(bonusHistory);

              

              const notification = new Record("notifications");
              notification.set("member_id", loanTaker.id);
              notification.set("type", "bonus_received");
              notification.set("title", "Bonus Received");
              notification.set("message", `You have received KES ${bonusPerLoanTaker.toFixed(2)} as bonus redistribution from members who haven't taken loans in the past 12 months.`);
              notification.set("read_status", false);
              $app.save(notification);
            });

            

            const companyTransaction = new Record("company_transactions");
            companyTransaction.set("transaction_type", "bonus_redistribution");
            companyTransaction.set("amount", companyBonus);
            companyTransaction.set("member_id", memberId);
            companyTransaction.set("description", `Company bonus from ${member.get("first_name")} ${member.get("last_name")}'s bonus deduction`);
            companyTransaction.set("date", new Date().toISOString());
            $app.save(companyTransaction);

            

            const deductionNotification = new Record("notifications");
            deductionNotification.set("member_id", memberId);
            deductionNotification.set("type", "bonus_deducted");
            deductionNotification.set("title", "Bonus Deducted");
            deductionNotification.set("message", `60% of your bonuses (KES ${deductionAmount.toFixed(2)}) have been deducted for not taking loans in the past 12 months. 50% distributed to loan takers, 10% to company.`);
            deductionNotification.set("read_status", false);
            $app.save(deductionNotification);

            console.log(`Deducted ${deductionAmount.toFixed(2)} from bonuses of member ${memberId} and redistributed`);
          }
        }
      }
    });

  } catch (err) {
    console.log("Error in bonus deduction check: " + err.message);
  }
});