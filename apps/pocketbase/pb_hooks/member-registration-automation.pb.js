/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  // Comprehensive member registration automation
  const memberRecord = e.record;
  const memberId = memberRecord.id;
  const location = memberRecord.get("location");

  if (!memberId) {
    e.next();
    return;
  }

  try {
    // 1. Send welcome notification
    const welcomeNotification = new Record("notifications");
    welcomeNotification.set("member_id", memberId);
    welcomeNotification.set("type", "welcome");
    welcomeNotification.set("title", "Welcome to HACRO Labs!");
    welcomeNotification.set("message", "Welcome to our savings and loan cooperative! Start by making your first savings contribution to become eligible for loans.");
    welcomeNotification.set("read_status", false);
    $app.save(welcomeNotification);

    // 2. Auto-assign to group based on location (enhancing existing logic)
    if (location) {
      // Find existing groups in the same location
      const existingGroups = $app.findRecordsByFilter("groups", "location = '" + location + "'", { limit: 1000 });

      let assignedGroup = null;

      // Try to find a group with less than 30 members
      for (let group of existingGroups) {
        const groupMembers = $app.findRecordsByFilter("group_members", "group_id = '" + group.id + "'", { limit: 1000 });

        if (groupMembers.length < 30) {
          assignedGroup = group;
          break;
        }
      }

      // If no suitable existing group, create a new one
      if (!assignedGroup) {
        const newGroup = new Record("groups");
        newGroup.set("name", `${location} Group ${existingGroups.length + 1}`);
        newGroup.set("location", location);
        newGroup.set("created_date", new Date().toISOString());
        newGroup.set("status", "active");
        $app.save(newGroup);
        assignedGroup = newGroup;
      }

      // Add member to the group
      const groupMember = new Record("group_members");
      groupMember.set("group_id", assignedGroup.id);
      groupMember.set("member_id", memberId);
      groupMember.set("joined_date", new Date().toISOString());
      groupMember.set("status", "active");
      $app.save(groupMember);

      // Notify member about group assignment
      const groupNotification = new Record("notifications");
      groupNotification.set("member_id", memberId);
      groupNotification.set("type", "group_assignment");
      groupNotification.set("title", "Group Assignment");
      groupNotification.set("message", `You have been assigned to "${assignedGroup.get("name")}" in ${location}`);
      groupNotification.set("read_status", false);
      $app.save(groupNotification);
    }

    // 3. Create initial savings record
    const initialSavings = new Record("savings");
    initialSavings.set("member_id", memberId);
    initialSavings.set("group_id", ""); // Will be updated when group is assigned
    initialSavings.set("total_savings", 0);
    initialSavings.set("last_contribution_date", new Date().toISOString());
    $app.save(initialSavings);

  } catch (err) {
    console.log("Error in member registration automation: " + err.message);
  }

  e.next();
}, "members");