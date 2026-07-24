onRecordAfterCreateSuccess((e) => {
  const groupMemberRecord = e.record;
  const groupId = groupMemberRecord.get("group_id");
  const memberId = groupMemberRecord.get("member_id");
  const joinedDate = groupMemberRecord.get("joined_date") || new Date().toISOString();

  if (!groupId || !memberId) {
    e.next();
    return;
  }

  try {
    let existingSavings = null;

    try {
      const found = $app.findRecordsByFilter("savings", "member_id = '" + memberId + "'", { limit: 1 });
      if (Array.isArray(found) && found.length > 0) {
        existingSavings = found[0];
      }
    } catch (err) {
      existingSavings = null;
    }

    if (existingSavings) {
      console.log("group-member-savings-automation: Savings already exists for member " + memberId);
      e.next();
      return;
    }

    const initialSavings = new Record("savings");
    initialSavings.set("member_id", memberId);
    initialSavings.set("group_id", groupId);
    initialSavings.set("amount", 0);
    initialSavings.set("date", joinedDate);
    initialSavings.set("description", "Initial savings account");
    $app.save(initialSavings);

    console.log("group-member-savings-automation: Initial savings created for member " + memberId + " in group " + groupId);
  } catch (err) {
    console.log("group-member-savings-automation: Error creating savings - " + (err?.message || err));
  }

  e.next();
}, "group_members");
