/// <reference path="../pb_data/types.d.ts" />
onRecordUpdate((e) => {
  // Comprehensive loan disbursement automation with new GIL/IL rules
  const loanRecord = e.record;
  const originalRecord = e.record.original();

  const newStatus = loanRecord.get("status");
  const oldStatus = originalRecord.get("status");
  const memberId = loanRecord.get("member_id");
  const groupId = loanRecord.get("group_id");
  const loanAmount = loanRecord.get("amount");
  const loanType = loanRecord.get("loan_type");

  // Only process when status changes to 'active' (disbursed)
  if (newStatus !== "active" || oldStatus === "active") {
    e.next();
    return;
  }

  if (!memberId || !groupId || !loanAmount) {
    e.next();
    return;
  }

  try {
    const disbursementDate = new Date().toISOString();

    // 1. Update loan with disbursement date
    loanRecord.set("disbursement_date", disbursementDate);
    $app.save(loanRecord);

    // 2. Create disbursement history record
    const disbursementHistory = new Record("contributions_history");
    disbursementHistory.set("member_id", memberId);
    disbursementHistory.set("group_id", groupId);
    disbursementHistory.set("type", "loan_disbursement");
    disbursementHistory.set("amount", loanAmount);
    disbursementHistory.set("date", disbursementDate);
    disbursementHistory.set("description", "Loan Disbursement");
    disbursementHistory.set("balance", loanAmount); // Initial loan balance
    $app.save(disbursementHistory);

    // 3. Handle interest distribution for GIL loans
    if (loanType === "GIL") {
      const interestAmount = loanAmount * 0.02; // 2% flat rate

      // 1% goes to company (this would be tracked separately)
      const companyShare = interestAmount * 0.5; // 1% of loan amount

      // 0.5% goes to all group members equally
      const groupBonus = interestAmount * 0.25; // 0.5% of loan amount

      // 0.5% goes to guarantors equally
      const guarantorBonus = interestAmount * 0.25; // 0.5% of loan amount

      // Get all group members
      const groupMembers = $app.findRecordsByFilter("group_members", "group_id = '" + groupId + "'", { limit: 1000 });
      const groupMemberCount = groupMembers.length;

      // Get guarantors for this loan
      const guarantors = $app.findRecordsByFilter("loan_guarantors", "loan_id = '" + loanRecord.id + "' && status = 'approved'", { limit: 1000 });
      const guarantorCount = guarantors.length;

      if (groupMemberCount > 0) {
        const bonusPerGroupMember = groupBonus / groupMemberCount;

        groupMembers.forEach((gm) => {
          // Update savings with group bonus
          const memberSavings = $app.findRecordsByFilter("savings", "member_id = '" + gm.get("member_id") + "'", { limit: 1 });
          if (memberSavings.length > 0) {
            const currentSavings = memberSavings[0].get("total_savings") || 0;
            memberSavings[0].set("total_savings", currentSavings + bonusPerGroupMember);
            $app.save(memberSavings[0]);

            // Create bonus history
            const bonusHistory = new Record("contributions_history");
            bonusHistory.set("member_id", gm.get("member_id"));
            bonusHistory.set("group_id", groupId);
            bonusHistory.set("type", "group_bonus");
            bonusHistory.set("amount", bonusPerGroupMember);
            bonusHistory.set("date", disbursementDate);
            bonusHistory.set("description", `Group bonus from GIL loan ${loanRecord.id}`);
            bonusHistory.set("balance", currentSavings + bonusPerGroupMember);
            $app.save(bonusHistory);
          }
        });
      }

      if (guarantorCount > 0) {
        const bonusPerGuarantor = guarantorBonus / guarantorCount;

        guarantors.forEach((guarantor) => {
          const guarantorId = guarantor.get("guarantor_id");

          // Update savings with guarantor bonus
          const guarantorSavings = $app.findRecordsByFilter("savings", "member_id = '" + guarantorId + "'", { limit: 1 });
          if (guarantorSavings.length > 0) {
            const currentSavings = guarantorSavings[0].get("total_savings") || 0;
            guarantorSavings[0].set("total_savings", currentSavings + bonusPerGuarantor);
            $app.save(guarantorSavings[0]);

            // Create bonus history
            const bonusHistory = new Record("contributions_history");
            bonusHistory.set("member_id", guarantorId);
            bonusHistory.set("group_id", groupId);
            bonusHistory.set("type", "guarantor_bonus");
            bonusHistory.set("amount", bonusPerGuarantor);
            bonusHistory.set("date", disbursementDate);
            bonusHistory.set("description", `Guarantor bonus from GIL loan ${loanRecord.id}`);
            bonusHistory.set("balance", currentSavings + bonusPerGuarantor);
            $app.save(bonusHistory);
          }
        });
      }

      // Log company share (this would be tracked in company accounts)
      console.log(`Company share from GIL loan ${loanRecord.id}: ${companyShare}`);
    }

    // 4. Notify the borrower
    const disbursementNotification = new Record("notifications");
    disbursementNotification.set("member_id", memberId);
    disbursementNotification.set("type", "disbursement");
    disbursementNotification.set("title", "Loan Disbursed");
    disbursementNotification.set("message", `Your ${loanType} loan of KES ${loanAmount.toLocaleString()} has been disbursed. Repayment over 3 months with 1 month grace period.`);
    disbursementNotification.set("read_status", false);
    $app.save(disbursementNotification);

    // 5. Notify group members about the disbursement
    const groupMembers = $app.findRecordsByFilter("group_members", "group_id = '" + groupId + "'", { limit: 1000 });

    groupMembers.forEach((gm) => {
      const gmMemberId = gm.get("member_id");

      // Don't notify the borrower again
      if (gmMemberId === memberId) {
        return;
      }

      const groupNotification = new Record("notifications");
      groupNotification.set("member_id", gmMemberId);
      groupNotification.set("type", "disbursement");
      groupNotification.set("title", "Loan Disbursement");
      groupNotification.set("message", `A ${loanType} loan of KES ${loanAmount.toLocaleString()} has been disbursed to a group member`);
      groupNotification.set("read_status", false);
      $app.save(groupNotification);
    });

    // 6. For GIL loans, update guarantor statuses to 'active'
    if (loanType === "GIL") {
      const guarantors = $app.findRecordsByFilter("loan_guarantors", "loan_id = '" + loanRecord.id + "'", { limit: 1000 });

      guarantors.forEach((guarantor) => {
        guarantor.set("status", "active");
        $app.save(guarantor);
      });
    }

  } catch (err) {
    console.log("Error in loan disbursement automation: " + err.message);
  }

  e.next();
}, "loans");