/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  // Comprehensive loan request automation with new GIL/IL rules
  const loanRecord = e.record;
  const memberId = loanRecord.get("member_id");
  const groupId = loanRecord.get("group_id");
  const loanType = loanRecord.get("loan_type");
  const requestedAmount = loanRecord.get("amount");

  if (!memberId || !groupId) {
    e.next();
    return;
  }

  try {
    // Get member details
    const member = $app.findRecordById("members", memberId);
    if (!member) {
      e.next();
      return;
    }

    // Check if member has been saving for 3 months (for IL loans)
    if (loanType === "IL") {
      const registrationDate = new Date(member.get("created"));
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

      if (registrationDate > threeMonthsAgo) {
        // Reject IL loan - member hasn't saved for 3 months
        loanRecord.set("status", "rejected");
        $app.save(loanRecord);

        const rejectionNotification = new Record("notifications");
        rejectionNotification.set("member_id", memberId);
        rejectionNotification.set("type", "rejection");
        rejectionNotification.set("title", "Loan Application Rejected");
        rejectionNotification.set("message", "Individual Loans (IL) require 3 months of membership before application.");
        rejectionNotification.set("read_status", false);
        $app.save(rejectionNotification);

        e.next();
        return;
      }

      // For IL loans, check if savings + bonuses can cover loan + 2% interest
      const memberSavings = $app.findRecordsByFilter("savings", "member_id = '" + memberId + "'", { limit: 1 });
      let totalSavings = 0;
      if (memberSavings.length > 0) {
        totalSavings = memberSavings[0].get("total_savings") || 0;
      }

      // Calculate bonuses (from interest earned)
      const bonusesEarned = $app.findRecordsByFilter("contributions_history",
        "member_id = '" + memberId + "' && type = 'interest_earned'", { limit: 1000 });
      let totalBonuses = 0;
      bonusesEarned.forEach(bonus => {
        totalBonuses += bonus.get("amount") || 0;
      });

      const maxLoanAmount = (totalSavings + totalBonuses) / 1.02; // Loan + 2% interest

      if (requestedAmount > maxLoanAmount) {
        // Reject IL loan - insufficient collateral
        loanRecord.set("status", "rejected");
        $app.save(loanRecord);

        const rejectionNotification = new Record("notifications");
        rejectionNotification.set("member_id", memberId);
        rejectionNotification.set("type", "rejection");
        rejectionNotification.set("title", "Loan Application Rejected");
        rejectionNotification.set("message", `Insufficient collateral. Maximum loan amount: KES ${maxLoanAmount.toFixed(2)} (based on your savings + bonuses)`);
        rejectionNotification.set("read_status", false);
        $app.save(rejectionNotification);

        e.next();
        return;
      }

      // IL loan approved automatically
      loanRecord.set("status", "approved");
      loanRecord.set("interest_rate", 0.02); // 2% flat rate
      loanRecord.set("repayment_period_months", 2); // 2 months repayment
      loanRecord.set("grace_period_months", 1); // 1 month grace period
      $app.save(loanRecord);

      // Create notification
      const approvalNotification = new Record("notifications");
      approvalNotification.set("member_id", memberId);
      approvalNotification.set("type", "approval");
      approvalNotification.set("title", "Individual Loan Approved");
      approvalNotification.set("message", `Your Individual Loan of KES ${requestedAmount.toLocaleString()} has been approved. Repayment over 2 months with 1 month grace period.`);
      approvalNotification.set("read_status", false);
      $app.save(approvalNotification);

      e.next();
      return;
    }

    // Handle GIL loans
    if (loanType === "GIL") {
      // 1. Create loan request notification for the borrower
      const requestNotification = new Record("notifications");
      requestNotification.set("member_id", memberId);
      requestNotification.set("type", "loan_request");
      requestNotification.set("title", "GIL Request Submitted");
      requestNotification.set("message", `Your Group Individual Loan request of KES ${requestedAmount.toLocaleString()} has been submitted. Please add guarantors from your group.`);
      requestNotification.set("read_status", false);
      $app.save(requestNotification);

      // 2. Get all group members for potential guarantors
      const groupMembers = $app.findRecordsByFilter("group_members", "group_id = '" + groupId + "'", { limit: 1000 });

      // 3. Notify group members about new GIL request (they can volunteer as guarantors)
      groupMembers.forEach((gm) => {
        const gmMemberId = gm.get("member_id");

        // Don't notify the borrower
        if (gmMemberId === memberId) {
          return;
        }

        const groupNotification = new Record("notifications");
        groupNotification.set("member_id", gmMemberId);
        groupNotification.set("type", "gil_request");
        groupNotification.set("title", "GIL Request Available");
        groupNotification.set("message", `A Group Individual Loan request of KES ${requestedAmount.toLocaleString()} is available. You can volunteer as a guarantor by providing collateral from your savings.`);
        groupNotification.set("read_status", false);
        $app.save(groupNotification);
      });
    }

  } catch (err) {
    console.log("Error in loan request automation: " + err.message);
  }

  e.next();
}, "loans");