/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateRequest((e) => {
  // Distribute interest earned from loans to savers
  const repaymentRecord = e.record;
  const loanId = repaymentRecord.get("loan_id");
  
  if (!loanId) {
    e.next();
    return;
  }
  
  try {
    // Get the loan details
    const loan = $app.findRecordById("loans", loanId);
    if (!loan) {
      e.next();
      return;
    }
    
    const groupId = loan.get("group_id");
    const loanAmount = loan.get("amount");
    const interestRate = loan.get("interest_rate") || 0;
    
    // Calculate total interest
    const totalInterest = loanAmount * (interestRate / 100);
    
    if (totalInterest <= 0) {
      e.next();
      return;
    }
    
    // Get all members in the group
    const groupMembers = $app.findRecordsByFilter("group_members", "group_id = '" + groupId + "'", { limit: 1000 });
    
    // Calculate total savings in the group
    let totalGroupSavings = 0;
    const memberSavings = {};
    
    groupMembers.forEach((gm) => {
      const memberId = gm.get("member_id");
      const savings = $app.findRecordsByFilter("savings", "member_id = '" + memberId + "' && group_id = '" + groupId + "'", { limit: 1000 });
      
      let memberTotal = 0;
      savings.forEach((s) => {
        memberTotal += s.get("amount") || 0;
      });
      
      memberSavings[memberId] = memberTotal;
      totalGroupSavings += memberTotal;
    });
    
    // Distribute bonuses proportionally
    if (totalGroupSavings > 0) {
      groupMembers.forEach((gm) => {
        const memberId = gm.get("member_id");
        const memberSavingsAmount = memberSavings[memberId] || 0;
        const savingsPercentage = memberSavingsAmount / totalGroupSavings;
        const bonusAmount = totalInterest * savingsPercentage;
        
        if (bonusAmount > 0) {
          const bonus = new Record("bonuses");
          bonus.set("member_id", memberId);
          bonus.set("group_id", groupId);
          bonus.set("amount", bonusAmount);
          bonus.set("source_loan_id", loanId);
          bonus.set("bonus_type", "interest_share");
          
          $app.save(bonus);
        }
        
        // Check if member qualifies for consistent_saver achievement (6+ months of savings)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        
        const recentSavings = $app.findRecordsByFilter("savings", "member_id = '" + memberId + "' && group_id = '" + groupId + "' && created >= '" + sixMonthsAgo.toISOString() + "'", { limit: 1000 });
        
        if (recentSavings.length >= 6) {
          // Check if achievement already exists
          const existingAchievement = $app.findFirstRecordByFilter("achievements", "member_id = '" + memberId + "' && achievement_type = 'consistent_saver'");
          
          if (!existingAchievement) {
            const achievement = new Record("achievements");
            achievement.set("member_id", memberId);
            achievement.set("achievement_type", "consistent_saver");
            achievement.set("description", "Saved consistently for 6+ months");
            
            $app.save(achievement);
          }
        }
      });
    }
    
  } catch (err) {
    console.log("Error in bonus-distribution: " + err.message);
  }
  
  e.next();
}, "loan_repayments");