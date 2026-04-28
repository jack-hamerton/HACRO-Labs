/// <reference path="../pb_data/types.d.ts" />
onRecordUpdate((e) => {
  // When loan status changes to 'active', notify the borrower
  const loanRecord = e.record;
  const originalRecord = e.record.original();
  
  const newStatus = loanRecord.get("status");
  const oldStatus = originalRecord.get("status");
  
  if (newStatus === "active" && oldStatus !== "active") {
    const memberId = loanRecord.get("member_id");
    
    if (memberId) {
      try {
        const notification = new Record("notifications");
        notification.set("member_id", memberId);
        notification.set("type", "disbursement");
        notification.set("title", "Loan Disbursed");
        notification.set("message", "Your loan has been disbursed to your account");
        notification.set("read_status", false);
        
        $app.save(notification);
      } catch (err) {
        console.log("Error creating loan disbursement notification: " + err.message);
      }
    }
  }
  
  e.next();
}, "loans");