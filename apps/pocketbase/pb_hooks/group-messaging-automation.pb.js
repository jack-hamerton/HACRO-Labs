/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  // Comprehensive group messaging automation
  const messageRecord = e.record;
  const groupId = messageRecord.get("group_id");
  const senderId = messageRecord.get("sender_id");
  const messageType = messageRecord.get("type");

  if (!groupId || !senderId) {
    e.next();
    return;
  }

  try {
    // 1. Get all group members
    const groupMembers = $app.findRecordsByFilter("group_members", "group_id = '" + groupId + "'", { limit: 1000 });

    // 2. Create notifications for all group members except sender
    groupMembers.forEach((gm) => {
      const memberId = gm.get("member_id");

      // Don't notify the sender
      if (memberId === senderId) {
        return;
      }

      const messageNotification = new Record("notifications");
      messageNotification.set("member_id", memberId);
      messageNotification.set("type", "message");
      messageNotification.set("title", "New Group Message");

      // Customize message based on type
      let messageText = "You have a new message in your group";
      if (messageType === "announcement") {
        messageText = "New announcement in your group";
      } else if (messageType === "meeting") {
        messageText = "New meeting notification in your group";
      } else if (messageType === "reminder") {
        messageText = "New reminder in your group";
      }

      messageNotification.set("message", messageText);
      messageNotification.set("read_status", false);
      $app.save(messageNotification);
    });

    // 3. For announcements, also create a system-wide notification if it's important
    if (messageType === "announcement") {
      const messageContent = messageRecord.get("content") || "";
      const isImportant = messageContent.toLowerCase().includes("important") ||
                         messageContent.toLowerCase().includes("urgent") ||
                         messageContent.toLowerCase().includes("emergency");

      if (isImportant) {
        // Get all members in the system for important announcements
        const allMembers = $app.findRecordsByFilter("members", "", { limit: 10000 });

        allMembers.forEach((member) => {
          // Skip if already notified as group member
          const isGroupMember = groupMembers.some(gm => gm.get("member_id") === member.id);
          if (isGroupMember) {
            return;
          }

          const importantNotification = new Record("notifications");
          importantNotification.set("member_id", member.id);
          importantNotification.set("type", "important_announcement");
          importantNotification.set("title", "Important System Announcement");
          importantNotification.set("message", "An important announcement has been posted. Please check your group messages.");
          importantNotification.set("read_status", false);
          $app.save(importantNotification);
        });
      }
    }

  } catch (err) {
    console.log("Error in group messaging automation: " + err.message);
  }

  e.next();
}, "group_messages");