/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  // Comprehensive penalty automation
  const penaltyRecord = e.record;
  const memberId = penaltyRecord.get("member_id");
  const loanId = penaltyRecord.get("loan_id");
  const amount = penaltyRecord.get("amount");
  const reason = penaltyRecord.get("reason");

  if (!memberId || !amount) {
    e.next();
    return;
  }

  try {
    // 1. Notify member about penalty
    const penaltyNotification = new Record("notifications");
    penaltyNotification.set("member_id", memberId);
    penaltyNotification.set("type", "penalty");
    penaltyNotification.set("title", "Penalty Applied");

    let message = `A penalty of KES ${amount.toLocaleString()} has been applied`;
    if (reason) {
      message += ` for: ${reason}`;
    }

    penaltyNotification.set("message", message);
    penaltyNotification.set("read_status", false);
    $app.save(penaltyNotification);

    // 2. If penalty is for a loan, update loan balance
    if (loanId) {
      const loan = $app.findRecordById("loans", loanId);
      if (loan) {
        const currentBalance = loan.get("balance") || 0;
        const newBalance = currentBalance + amount;

        loan.set("balance", newBalance);
        $app.save(loan);

        // Create penalty history record
        const penaltyHistory = new Record("contributions_history");
        penaltyHistory.set("member_id", memberId);
        penaltyHistory.set("group_id", loan.get("group_id"));
        penaltyHistory.set("type", "penalty");
        penaltyHistory.set("amount", amount);
        penaltyHistory.set("date", new Date().toISOString());
        penaltyHistory.set("description", `Penalty: ${reason || 'Loan penalty'}`);
        penaltyHistory.set("balance", newBalance);
        $app.save(penaltyHistory);
      }
    }

    // 3. Check if member has accumulated too many penalties
    const recentPenalties = $app.findRecordsByFilter(
      "penalties",
      "member_id = '" + memberId + "' && created_date > '" + new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() + "'",
      { limit: 1000 }
    );

    const totalRecentPenalties = recentPenalties.length;
    const totalPenaltyAmount = recentPenalties.reduce((sum, p) => sum + (p.get("amount") || 0), 0);

    // Warning for frequent penalties
    if (totalRecentPenalties >= 3) {
      const warningNotification = new Record("notifications");
      warningNotification.set("member_id", memberId);
      warningNotification.set("type", "warning");
      warningNotification.set("title", "Penalty Warning");
      warningNotification.set("message", `You have received ${totalRecentPenalties} penalties in the last 30 days totaling KES ${totalPenaltyAmount.toLocaleString()}. Please ensure timely payments to avoid further penalties.`);
      warningNotification.set("read_status", false);
      $app.save(warningNotification);
    }

    // 4. For loan-related penalties, notify group members
    if (loanId) {
      const loan = $app.findRecordById("loans", loanId);
      if (loan) {
        const groupId = loan.get("group_id");
        const groupMembers = $app.findRecordsByFilter("group_members", "group_id = '" + groupId + "'", { limit: 1000 });

        groupMembers.forEach((gm) => {
          const gmMemberId = gm.get("member_id");

          // Don't notify the penalized member again
          if (gmMemberId === memberId) {
            return;
          }

          const groupNotification = new Record("notifications");
          groupNotification.set("member_id", gmMemberId);
          groupNotification.set("type", "penalty");
          groupNotification.set("title", "Group Member Penalty");
          groupNotification.set("message", `A group member has received a penalty of KES ${amount.toLocaleString()} for late loan repayment`);
          groupNotification.set("read_status", false);
          $app.save(groupNotification);
        });
      }
    }

  } catch (err) {
    console.log("Error in penalty automation: " + err.message);
  }

  e.next();
}, "penalties");