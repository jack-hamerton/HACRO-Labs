

onRecordAfterCreateSuccess((e) => {
  

  const contributionRecord = e.record;
  const memberId = contributionRecord.get("member_id");
  const groupId = contributionRecord.get("group_id");
  const amount = contributionRecord.get("amount");

  if (!memberId || !groupId || !amount) {
    e.next();
    return;
  }

  try {
    

    let savingsRecord = null;
    const existingSavings = $app.findRecordsByFilter("savings", "member_id = '" + memberId + "'", { limit: 1 });

    if (existingSavings.length > 0) {
      savingsRecord = existingSavings[0];
    } else {
      

      savingsRecord = new Record("savings");
      savingsRecord.set("member_id", memberId);
      savingsRecord.set("group_id", groupId);
      savingsRecord.set("total_savings", 0);
      savingsRecord.set("last_contribution_date", new Date().toISOString());
      $app.save(savingsRecord);
    }

    

    const currentSavings = savingsRecord.get("total_savings") || 0;
    const newSavings = currentSavings + amount;

    savingsRecord.set("total_savings", newSavings);
    savingsRecord.set("last_contribution_date", new Date().toISOString());
    $app.save(savingsRecord);

    

    const contributionHistory = new Record("contributions_history");
    contributionHistory.set("member_id", memberId);
    contributionHistory.set("group_id", groupId);
    contributionHistory.set("type", "savings_contribution");
    contributionHistory.set("amount", amount);
    contributionHistory.set("date", new Date().toISOString());
    contributionHistory.set("description", "Savings Contribution");
    contributionHistory.set("balance", newSavings);
    $app.save(contributionHistory);

    

    const contributionNotification = new Record("notifications");
    contributionNotification.set("member_id", memberId);
    contributionNotification.set("type", "contribution");
    contributionNotification.set("title", "Contribution Received");
    contributionNotification.set("message", `Your savings contribution of KES ${amount.toLocaleString()} has been received. Total savings: KES ${newSavings.toLocaleString()}`);
    contributionNotification.set("read_status", false);
    $app.save(contributionNotification);

    

    const loanEligibilityThreshold = 3000; 

    if (newSavings >= loanEligibilityThreshold && currentSavings < loanEligibilityThreshold) {
      const eligibilityNotification = new Record("notifications");
      eligibilityNotification.set("member_id", memberId);
      eligibilityNotification.set("type", "eligibility");
      eligibilityNotification.set("title", "Loan Eligibility Unlocked");
      eligibilityNotification.set("message", `Congratulations! You are now eligible to apply for loans with your savings of KES ${newSavings.toLocaleString()}`);
      eligibilityNotification.set("read_status", false);
      $app.save(eligibilityNotification);
    }

  } catch (err) {
    console.log("Error in savings contribution automation: " + err.message);
  }

  e.next();
}, "savings_contributions");