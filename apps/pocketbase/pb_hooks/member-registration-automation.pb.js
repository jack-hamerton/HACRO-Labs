

onRecordAfterCreateSuccess((e) => {
  

  const memberRecord = e.record;
  const memberId = memberRecord.id;
  const location = memberRecord.get("location");

  if (!memberId) {
    e.next();
    return;
  }

  try {
    

    const welcomeNotification = new Record("notifications");
    welcomeNotification.set("member_id", memberId);
    welcomeNotification.set("type", "welcome");
    welcomeNotification.set("title", "Welcome to HACRO Labs!");
    welcomeNotification.set("message", "Welcome to our savings and loan cooperative! Start by making your first savings contribution to become eligible for loans.");
    welcomeNotification.set("read_status", false);
    $app.save(welcomeNotification);

    

    


    

    const initialSavings = new Record("savings");
    initialSavings.set("member_id", memberId);
    initialSavings.set("group_id", ""); 

    initialSavings.set("total_savings", 0);
    initialSavings.set("last_contribution_date", new Date().toISOString());
    $app.save(initialSavings);

  } catch (err) {
    console.log("Error in member registration automation: " + err.message);
  }

  e.next();
}, "members");