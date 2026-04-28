/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  // When a message is created, notify all group members
  const messageRecord = e.record;
  const groupId = messageRecord.get("group_id");
  const senderId = messageRecord.get("member_id");
  
  if (!groupId) {
    e.next();
    return;
  }
  
  try {
    // Find all members in the group
    const groupMembers = $app.findRecordsByFilter("group_members", "group_id = '" + groupId + "'", { limit: 1000 });
    
    groupMembers.forEach((gm) => {
      const gmMemberId = gm.get("member_id");
      
      // Don't notify the sender
      if (gmMemberId === senderId) {
        return;
      }
      
      // Create notification for each group member
      const notification = new Record("notifications");
      notification.set("member_id", gmMemberId);
      notification.set("type", "message");
      notification.set("title", "New Group Message");
      notification.set("message", "A new message has been posted in your group");
      notification.set("read_status", false);
      
      $app.save(notification);
    });
  } catch (err) {
    console.log("Error creating message notifications: " + err.message);
  }
  
  e.next();
}, "messages");