/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  // Automatically calculate and apply penalties for overdue loan repayments
  const repaymentRecord = e.record;
  const loanId = repaymentRecord.get("loan_id");
  const paymentDate = repaymentRecord.get("date");
  const memberId = repaymentRecord.get("member_id");
  
  if (!loanId || !paymentDate || !memberId) {
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
    
    // Get the repayment period and disbursement date
    const disbursementDate = loan.get("disbursement_date");
    const repaymentPeriod = loan.get("repayment_period") || 0;
    
    if (!disbursementDate || repaymentPeriod <= 0) {
      e.next();
      return;
    }
    
    // Calculate due date (disbursement date + repayment period in months)
    const dueDate = new Date(disbursementDate);
    dueDate.setMonth(dueDate.getMonth() + repaymentPeriod);
    
    // Check if payment is overdue
    const paymentDateObj = new Date(paymentDate);
    const today = new Date();
    
    if (paymentDateObj > dueDate) {
      // Calculate days late
      const daysLate = Math.floor((paymentDateObj - dueDate) / (1000 * 60 * 60 * 24));
      
      // Calculate penalty: 1% per day late (or 5% per week)
      const penaltyRate = 0.01; // 1% per day
      const loanAmount = loan.get("amount") || 0;
      const penaltyAmount = loanAmount * penaltyRate * daysLate;
      
      if (penaltyAmount > 0) {
        // Create penalty record
        const penalty = new Record("penalties");
        penalty.set("loan_id", loanId);
        penalty.set("member_id", memberId);
        penalty.set("amount", penaltyAmount);
        penalty.set("date_applied", today.toISOString().split('T')[0]);
        penalty.set("reason", "Late repayment - " + daysLate + " days overdue");
        penalty.set("waived", false);
        
        $app.save(penalty);
        
        // Create notification for member
        const notification = new Record("notifications");
        notification.set("member_id", memberId);
        notification.set("type", "penalty");
        notification.set("title", "Penalty Applied");
        notification.set("message", "A penalty of " + penaltyAmount.toFixed(2) + " has been applied for late repayment");
        notification.set("read_status", false);
        
        $app.save(notification);
      }
    }
    
  } catch (err) {
    console.log("Error in penalty-calculation: " + err.message);
  }
  
  e.next();
}, "loan_repayments");