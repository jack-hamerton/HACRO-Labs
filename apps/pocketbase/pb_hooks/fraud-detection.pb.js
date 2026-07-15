

onRecordAfterCreateSuccess((e) => {
  

  const paymentRecord = e.record;
  const memberId = paymentRecord.get("member_id");
  const amount = paymentRecord.get("amount");
  const paymentType = paymentRecord.get("payment_type");

  if (!memberId || !amount) {
    e.next();
    return;
  }

  try {
    

    const member = $app.findRecordById("members", memberId);
    if (!member) {
      e.next();
      return;
    }

    const memberName = `${member.get("first_name")} ${member.get("last_name")}`;

    

    let fraudAlerts = [];

    

    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);

    const recentPayments = $app.findRecordsByFilter(
      "payments",
      `member_id = '${memberId}' && created >= '${oneHourAgo.toISOString()}'`,
      { limit: 100 }
    );

    if (recentPayments.length > 5) {
      fraudAlerts.push(`Unusual transaction volume: ${recentPayments.length} payments in the last hour`);
    }

    

    const allMemberPayments = $app.findRecordsByFilter(
      "payments",
      `member_id = '${memberId}'`,
      { limit: 1000 }
    );

    let avgAmount = 0;
    let paymentCount = 0;

    allMemberPayments.forEach((payment) => {
      avgAmount += payment.get("amount") || 0;
      paymentCount++;
    });

    if (paymentCount > 0) {
      avgAmount = avgAmount / paymentCount;

      

      if (amount > avgAmount * 5) {
        fraudAlerts.push(`Unusually large payment: KES ${amount.toLocaleString()} (5x average of KES ${avgAmount.toFixed(2)})`);
      }
    }

    

    if (amount % 1000 === 0 && amount >= 10000) {
      fraudAlerts.push(`Suspicious round number payment: KES ${amount.toLocaleString()}`);
    }

    

    if (recentPayments.length >= 2) {
      const sortedPayments = recentPayments.sort((a, b) => new Date(b.get("created")) - new Date(a.get("created")));
      const timeDiff = new Date(sortedPayments[0].get("created")) - new Date(sortedPayments[1].get("created"));
      const minutesDiff = timeDiff / (1000 * 60);

      if (minutesDiff < 5) { 

        fraudAlerts.push(`Rapid successive payments detected (${minutesDiff.toFixed(1)} minutes apart)`);
      }
    }

    


    


    

    const paymentHour = new Date().getHours();
    if (paymentHour < 6 || paymentHour > 22) { 

      fraudAlerts.push(`Payment made at unusual hour: ${paymentHour}:00`);
    }

    

    const largePayments = allMemberPayments.filter(p => (p.get("amount") || 0) >= 50000);
    if (largePayments.length >= 3) {
      fraudAlerts.push(`Multiple large payments detected (${largePayments.length} payments >= KES 50,000)`);
    }

    

    if (fraudAlerts.length > 0) {
      

      const fraudAlert = new Record("fraud_alerts");
      fraudAlert.set("member_id", memberId);
      fraudAlert.set("payment_id", paymentRecord.id);
      fraudAlert.set("alert_type", "payment_anomaly");
      fraudAlert.set("severity", fraudAlerts.length > 2 ? "high" : "medium");
      fraudAlert.set("description", fraudAlerts.join("; "));
      fraudAlert.set("status", "pending_review");
      fraudAlert.set("detected_at", new Date().toISOString());
      $app.save(fraudAlert);

      

      const admins = $app.findRecordsByFilter("pbc_admins_auth", "", { limit: 100 });
      admins.forEach((admin) => {
        const adminNotification = new Record("notifications");
        adminNotification.set("member_id", admin.id); 

        adminNotification.set("type", "fraud_alert");
        adminNotification.set("title", "Fraud Alert Detected");
        adminNotification.set("message", `Fraud alert for ${memberName}: ${fraudAlerts.join("; ")}. Payment: KES ${amount.toLocaleString()} (${paymentType})`);
        adminNotification.set("read_status", false);
        $app.save(adminNotification);
      });

      

      const memberNotification = new Record("notifications");
      memberNotification.set("member_id", memberId);
      memberNotification.set("type", "payment_flagged");
      memberNotification.set("title", "Payment Flagged for Review");
      memberNotification.set("message", `Your payment of KES ${amount.toLocaleString()} has been flagged for security review. This is a standard procedure and your payment will be processed shortly.`);
      memberNotification.set("read_status", false);
      $app.save(memberNotification);

      console.log(`Fraud alert created for member ${memberId}: ${fraudAlerts.join("; ")}`);
    }

  } catch (err) {
    console.log("Error in fraud detection: " + err.message);
  }

  e.next();
}, "payments");