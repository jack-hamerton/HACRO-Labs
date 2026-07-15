

const roundCurrencyLoanRequest = (value) => Math.round((Number(value) || 0) * 100) / 100;

onRecordAfterCreateSuccess(async (e) => {
  const loanRecord = e.record;
  const memberId = loanRecord.get("member_id");
  const groupId = loanRecord.get("group_id");
  const loanType = loanRecord.get("loan_type");
  const requestedAmount = roundCurrencyLoanRequest(loanRecord.get("amount") || 0);

  if (!memberId || !groupId) {
    e.next();
    return;
  }

  try {
    const member = $app.findRecordById("members", memberId);
    if (!member) {
      e.next();
      return;
    }

    const interestRate = Number(loanRecord.get("interest_rate") || (loanType === "IL" ? 0.02 : 0.01));
    const interestAmount = roundCurrencyLoanRequest(requestedAmount * interestRate);
    const totalRepayable = roundCurrencyLoanRequest(requestedAmount + interestAmount);

    if (loanType === "IL") {
      const registrationDate = new Date(member.get("created"));
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

      const memberSavings = $app.findRecordsByFilter("savings", "member_id = '" + memberId + "'", { limit: 1 });
      let totalSavings = 0;
      if (memberSavings.length > 0) {
        totalSavings = roundCurrencyLoanRequest(memberSavings[0].get("total_savings") || 0);
      }

      const bonusesEarned = $app.findRecordsByFilter(
        "contributions_history",
        "member_id = '" + memberId + "' && type = 'interest_earned'",
        { limit: 1000 }
      );
      let totalBonuses = 0;
      bonusesEarned.forEach((bonus) => {
        totalBonuses += roundCurrency(bonus.get("amount") || 0);
      });

      const maxLoanAmount = roundCurrencyLoanRequest((totalSavings + totalBonuses) / 1.02);
      const eligibilityMessage = registrationDate > threeMonthsAgo
        ? "Your request is pending admin review because the member has not yet completed the required savings period."
        : requestedAmount > maxLoanAmount
          ? `Your request is pending admin review because the requested amount exceeds the calculated eligibility of KES ${maxLoanAmount.toFixed(2)}.`
          : "Your request is pending admin review and will be assessed by an administrator.";

      loanRecord.set("status", "pending");
      $app.save(loanRecord);

      const pendingNotification = new Record("notifications");
      pendingNotification.set("member_id", memberId);
      pendingNotification.set("type", "loan_request");
      pendingNotification.set("title", "Individual Loan Request Submitted");
      pendingNotification.set("message", `Your IL loan request of KES ${requestedAmount.toLocaleString()} is now pending admin review. Principal: KES ${requestedAmount.toLocaleString()}, interest: KES ${interestAmount.toLocaleString()}, estimated repayment total: KES ${totalRepayable.toLocaleString()}. ${eligibilityMessage}`);
      pendingNotification.set("read_status", false);
      $app.save(pendingNotification);

      e.next();
      return;
    }

    if (loanType === "GIL") {
      const requestNotification = new Record("notifications");
      requestNotification.set("member_id", memberId);
      requestNotification.set("type", "loan_request");
      requestNotification.set("title", "GIL Request Submitted");
      requestNotification.set("message", `Your GIL loan request of KES ${requestedAmount.toLocaleString()} is now pending admin review. Principal: KES ${requestedAmount.toLocaleString()}, interest: KES ${interestAmount.toLocaleString()}, estimated repayment total: KES ${totalRepayable.toLocaleString()}. Please add guarantors from your group.`);
      requestNotification.set("read_status", false);
      $app.save(requestNotification);

      const groupMembers = $app.findRecordsByFilter("group_members", "group_id = '" + groupId + "'", { limit: 1000 });

      groupMembers.forEach((gm) => {
        const gmMemberId = gm.get("member_id");
        if (gmMemberId === memberId) {
          return;
        }

        const groupNotification = new Record("notifications");
        groupNotification.set("member_id", gmMemberId);
        groupNotification.set("type", "gil_request");
        groupNotification.set("title", "GIL Request Available");
        groupNotification.set("message", `A GIL loan request of KES ${requestedAmount.toLocaleString()} is pending admin review and is available for guarantor confirmation.`);
        groupNotification.set("read_status", false);
        $app.save(groupNotification);
      });
    }
  } catch (err) {
    console.log("Error in loan request automation: " + err.message);
  }

  e.next();
}, "loans");