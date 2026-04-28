/// <reference path="../pb_data/types.d.ts" />
onRecordUpdate((e) => {
  // Comprehensive admin action automation
  const record = e.record;
  const originalRecord = e.record.original();
  const collectionName = e.collection.name;

  try {
    // Handle different admin actions based on collection
    if (collectionName === "loans") {
      // Admin loan management actions
      const newStatus = record.get("status");
      const oldStatus = originalRecord.get("status");
      const memberId = record.get("member_id");

      if (newStatus !== oldStatus && newStatus === "rejected") {
        // Admin rejected loan
        const rejectionNotification = new Record("notifications");
        rejectionNotification.set("member_id", memberId);
        rejectionNotification.set("type", "rejection");
        rejectionNotification.set("title", "Loan Application Rejected");
        rejectionNotification.set("message", "Your loan application has been reviewed and rejected by the admin. Please contact admin for more details.");
        rejectionNotification.set("read_status", false);
        $app.save(rejectionNotification);
      }

    } else if (collectionName === "members") {
      // Admin member management actions
      const newStatus = record.get("status");
      const oldStatus = originalRecord.get("status");
      const memberId = record.id;

      if (newStatus !== oldStatus) {
        if (newStatus === "suspended") {
          const suspensionNotification = new Record("notifications");
          suspensionNotification.set("member_id", memberId);
          suspensionNotification.set("type", "suspension");
          suspensionNotification.set("title", "Account Suspended");
          suspensionNotification.set("message", "Your account has been suspended by admin. Please contact admin for assistance.");
          suspensionNotification.set("read_status", false);
          $app.save(suspensionNotification);
        } else if (newStatus === "active" && oldStatus === "suspended") {
          const reactivationNotification = new Record("notifications");
          reactivationNotification.set("member_id", memberId);
          reactivationNotification.set("type", "reactivation");
          reactivationNotification.set("title", "Account Reactivated");
          reactivationNotification.set("message", "Your account has been reactivated. You can now access all features.");
          reactivationNotification.set("read_status", false);
          $app.save(reactivationNotification);
        }
      }

    } else if (collectionName === "groups") {
      // Admin group management actions
      const newStatus = record.get("status");
      const oldStatus = originalRecord.get("status");
      const groupId = record.id;

      if (newStatus !== oldStatus && newStatus === "inactive") {
        // Group deactivated - notify all members
        const groupMembers = $app.findRecordsByFilter("group_members", "group_id = '" + groupId + "'", { limit: 1000 });

        groupMembers.forEach((gm) => {
          const deactivationNotification = new Record("notifications");
          deactivationNotification.set("member_id", gm.get("member_id"));
          deactivationNotification.set("type", "group_change");
          deactivationNotification.set("title", "Group Deactivated");
          deactivationNotification.set("message", "Your group has been deactivated by admin. You may be reassigned to another group.");
          deactivationNotification.set("read_status", false);
          $app.save(deactivationNotification);
        });
      }
    }

  } catch (err) {
    console.log("Error in admin action automation: " + err.message);
  }

  e.next();
});