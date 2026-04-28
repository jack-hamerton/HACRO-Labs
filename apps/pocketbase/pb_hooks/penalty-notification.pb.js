/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  // When a penalty is created, notify the member
  const penaltyRecord = e.record;
  const memberId = penaltyRecord.get("member_id");
  
  if (memberId) {
    try {
      const notification = new Record("notifications");
      notification.set("member_id", memberId);
      notification.set("type", "penalty");
      notification.set("title", "Penalty Applied");
      notification.set("message", "A penalty has been applied to your account");
      notification.set("read_status", false);
      
      $app.save(notification);
    } catch (err) {
      console.log("Error creating penalty notification: " + err.message);
    }
  }
  
  e.next();
}, "penalties");