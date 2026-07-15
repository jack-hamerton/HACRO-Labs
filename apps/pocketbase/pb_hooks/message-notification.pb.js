

onRecordAfterCreateSuccess((e) => {
  

  const messageRecord = e.record;
  const groupId = messageRecord.get("group_id");
  const senderId = messageRecord.get("member_id");
  
  if (!groupId) {
    e.next();
    return;
  }
  
  try {
    

    const groupMembers = $app.findRecordsByFilter("group_members", "group_id = '" + groupId + "'", { limit: 1000 });
    
    groupMembers.forEach((gm) => {
      const gmMemberId = gm.get("member_id");
      
      

      if (gmMemberId === senderId) {
        return;
      }
      
      

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