/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  // Fraud detection automation for payments
  const paymentRecord = e.record;
  const memberId = paymentRecord.get("member_id");
  const amount = paymentRecord.get("amount");
  const paymentType = paymentRecord.get("payment_type");

  if (!memberId || !amount) {
    e.next();
    return;
  }

  try {
    // Get member details
    const member = $app.findRecordById("members", memberId);
    if (!member) {
      e.next();
      return;
    }

    const memberName = `${member.get("first_name")} ${member.get("last_name")}`;

    // Fraud Detection Checks
    let fraudAlerts = [];

    // 1. Check for unusual transaction volume (more than 5 transactions in an hour)
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

    // 2. Check for unfamiliar charges (amounts that are not typical for this member)
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

      // Flag if current payment is more than 5x the average
      if (amount > avgAmount * 5) {
        fraudAlerts.push(`Unusually large payment: KES ${amount.toLocaleString()} (5x average of KES ${avgAmount.toFixed(2)})`);
      }
    }

    // 3. Check for round number amounts that might indicate fraud
    if (amount % 1000 === 0 && amount >= 10000) {
      fraudAlerts.push(`Suspicious round number payment: KES ${amount.toLocaleString()}`);
    }

    // 4. Check for rapid successive payments
    if (recentPayments.length >= 2) {
      const sortedPayments = recentPayments.sort((a, b) => new Date(b.get("created")) - new Date(a.get("created")));
      const timeDiff = new Date(sortedPayments[0].get("created")) - new Date(sortedPayments[1].get("created"));
      const minutesDiff = timeDiff / (1000 * 60);

      if (minutesDiff < 5) { // Payments within 5 minutes
        fraudAlerts.push(`Rapid successive payments detected (${minutesDiff.toFixed(1)} minutes apart)`);
      }
    }

    // 5. Check for inconsistent document patterns (if applicable)
    // This would require additional document verification logic

    // 6. Check for geographic anomalies (if IP/location data available)
    // This would require IP geolocation data

    // 7. Check for time-based anomalies (payments at unusual hours)
    const paymentHour = new Date().getHours();
    if (paymentHour < 6 || paymentHour > 22) { // Outside 6 AM - 10 PM
      fraudAlerts.push(`Payment made at unusual hour: ${paymentHour}:00`);
    }

    // 8. Check for amount patterns that might indicate money laundering
    const largePayments = allMemberPayments.filter(p => (p.get("amount") || 0) >= 50000);
    if (largePayments.length >= 3) {
      fraudAlerts.push(`Multiple large payments detected (${largePayments.length} payments >= KES 50,000)`);
    }

    // If fraud alerts detected, create notifications and flag for review
    if (fraudAlerts.length > 0) {
      // Create fraud alert record
      const fraudAlert = new Record("fraud_alerts");
      fraudAlert.set("member_id", memberId);
      fraudAlert.set("payment_id", paymentRecord.id);
      fraudAlert.set("alert_type", "payment_anomaly");
      fraudAlert.set("severity", fraudAlerts.length > 2 ? "high" : "medium");
      fraudAlert.set("description", fraudAlerts.join("; "));
      fraudAlert.set("status", "pending_review");
      fraudAlert.set("detected_at", new Date().toISOString());
      $app.save(fraudAlert);

      // Notify admins
      const admins = $app.findRecordsByFilter("pbc_admins_auth", "", { limit: 100 });
      admins.forEach((admin) => {
        const adminNotification = new Record("notifications");
        adminNotification.set("member_id", admin.id); // Assuming admins can receive notifications
        adminNotification.set("type", "fraud_alert");
        adminNotification.set("title", "Fraud Alert Detected");
        adminNotification.set("message", `Fraud alert for ${memberName}: ${fraudAlerts.join("; ")}. Payment: KES ${amount.toLocaleString()} (${paymentType})`);
        adminNotification.set("read_status", false);
        $app.save(adminNotification);
      });

      // Notify member
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