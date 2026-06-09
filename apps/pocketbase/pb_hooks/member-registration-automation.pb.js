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

    // 2. Group assignment is delegated to the auto-group-assignment hook.
    // This hook keeps registration automation focused on notifications and savings setup.

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