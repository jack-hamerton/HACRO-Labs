/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  // Automatically assign members to themed groups based on location
  const memberRecord = e.record;
  const location = memberRecord.get("location");
  const memberId = memberRecord.id;
  
  if (!location) {
    e.next();
    return;
  }
  
  const animalThemes = ["Phoenix", "Eagle", "Lion", "Tiger", "Falcon", "Hawk", "Raven", "Wolf", "Bear", "Panther", "Cheetah", "Leopard", "Jaguar", "Puma", "Cougar"];
  
  try {
    // Find or create a group for this location
    let group = $app.findFirstRecordByFilter("groups", "region = '" + location + "'");
    
    if (!group) {
      // Count existing groups in this region to determine which animal theme to use
      const existingGroups = $app.findRecordsByFilter("groups", "region = '" + location + "'", { limit: 1000 });
      const themeIndex = existingGroups.length % animalThemes.length;
      const themeName = animalThemes[themeIndex];
      
      // Create new group
      group = new Record("groups");
      group.set("group_name", themeName + " - " + location);
      group.set("region", location);
      group.set("member_count", 0);
      
      $app.save(group);
    }
    
    // Create group_members record
    const groupMember = new Record("group_members");
    groupMember.set("group_id", group.id);
    groupMember.set("member_id", memberId);
    
    $app.save(groupMember);
    
    // Update group member count
    const memberCount = $app.findRecordsByFilter("group_members", "group_id = '" + group.id + "'", { limit: 1000 }).length;
    group.set("member_count", memberCount);
    $app.save(group);
    
  } catch (err) {
    console.log("Error in auto-group-assignment: " + err.message);
  }
  
  e.next();
}, "members");