

onRecordAfterCreateSuccess((e) => {
  

  const memberRecord = e.record;
  const location = memberRecord.get("location");
  const memberId = memberRecord.id;
  
  if (!location) {
    e.next();
    return;
  }
  
  const animalThemes = ["Phoenix", "Eagle", "Lion", "Tiger", "Falcon", "Hawk", "Raven", "Wolf", "Bear", "Panther", "Cheetah", "Leopard", "Jaguar", "Puma", "Cougar"];
  
  try {
    const escapeFilterValue = (value) => {
      return typeof value === 'string' ? value.replace(/'/g, "\\'") : value;
    };

    const locationFilter = escapeFilterValue(location);
    const kinFilter = escapeFilterValue(memberRecord.get("spouse_kin_name"));

    let group = null;

    // Match same next of kin and same location whenever possible.
    if (kinFilter) {
      const matchingMembers = $app.findRecordsByFilter(
        "members",
        "location = '" + locationFilter + "' && spouse_kin_name = '" + kinFilter + "'",
        { limit: 1000 }
      );

      for (let existingMember of matchingMembers) {
        if (existingMember.id === memberId) continue;
        const existingGroupMember = $app.findFirstRecordByFilter(
          "group_members",
          "member_id = '" + existingMember.id + "'",
          { limit: 1 }
        );

        if (existingGroupMember) {
          group = $app.findRecord("groups", existingGroupMember.get("group_id"));
          if (group) break;
        }
      }
    }

    // If no kin-based group exists, fall back to a location-based group.
    if (!group) {
      group = $app.findFirstRecordByFilter("groups", "region = '" + locationFilter + "'");
    }

    if (!group) {
      const existingGroups = $app.findRecordsByFilter("groups", "region = '" + locationFilter + "'", { limit: 1000 });
      const themeIndex = existingGroups.length % animalThemes.length;
      const themeName = animalThemes[themeIndex];

      group = new Record("groups");
      group.set("group_name", themeName + " - " + location);
      group.set("region", location);
      group.set("member_count", 0);
      $app.save(group);
    }

    const existingMemberLink = $app.findFirstRecordByFilter(
      "group_members",
      "group_id = '" + group.id + "' && member_id = '" + memberId + "'",
      { limit: 1 }
    );

    if (!existingMemberLink) {
      const groupMember = new Record("group_members");
      groupMember.set("group_id", group.id);
      groupMember.set("member_id", memberId);
      $app.save(groupMember);
    }

    const memberCount = $app.findRecordsByFilter("group_members", "group_id = '" + group.id + "'", { limit: 1000 }).length;
    group.set("member_count", memberCount);
    $app.save(group);
  } catch (err) {
    console.log("Error in auto-group-assignment: " + err.message);
  }
  
  e.next();
}, "members");