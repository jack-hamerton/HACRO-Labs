/// <reference path="../pb_data/types.d.ts" />
onRecordUpdate((e) => {
  // When loan status changes to 'approved', notify the borrower
  const loanRecord = e.record;
  const originalRecord = e.record.original();
  
  const newStatus = loanRecord.get("status");
  const oldStatus = originalRecord.get("status");
  
  if (newStatus === "approved" && oldStatus !== "approved") {
    const memberId = loanRecord.get("member_id");
    
    if (memberId) {
      try {
        const notification = new Record("notifications");
        notification.set("member_id", memberId);
        notification.set("type", "approval");
        notification.set("title", "Loan Approved");
        notification.set("message", "Your loan request has been approved");
        notification.set("read_status", false);
        
        $app.save(notification);
      } catch (err) {
        console.log("Error creating loan approval notification: " + err.message);
      }
    }
  }
  
  e.next();
}, "loans");