

onRecordAfterCreateSuccess((e) => {
  

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

    

    if (loanId) {
      const loan = $app.findRecordById("loans", loanId);
      if (loan) {
        const currentBalance = loan.get("balance") || 0;
        const newBalance = currentBalance + amount;

        loan.set("balance", newBalance);
        $app.save(loan);

        

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

    

    const recentPenalties = $app.findRecordsByFilter(
      "penalties",
      "member_id = '" + memberId + "' && created > '" + new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() + "'",
      { limit: 1000 }
    );

    const totalRecentPenalties = recentPenalties.length;
    const totalPenaltyAmount = recentPenalties.reduce((sum, p) => sum + (p.get("amount") || 0), 0);

    

    if (totalRecentPenalties >= 3) {
      const warningNotification = new Record("notifications");
      warningNotification.set("member_id", memberId);
      warningNotification.set("type", "warning");
      warningNotification.set("title", "Penalty Warning");
      warningNotification.set("message", `You have received ${totalRecentPenalties} penalties in the last 30 days totaling KES ${totalPenaltyAmount.toLocaleString()}. Please ensure timely payments to avoid further penalties.`);
      warningNotification.set("read_status", false);
      $app.save(warningNotification);
    }

    

    if (loanId) {
      const loan = $app.findRecordById("loans", loanId);
      if (loan) {
        const groupId = loan.get("group_id");
        const groupMembers = $app.findRecordsByFilter("group_members", "group_id = '" + groupId + "'", { limit: 1000 });

        groupMembers.forEach((gm) => {
          const gmMemberId = gm.get("member_id");

          

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