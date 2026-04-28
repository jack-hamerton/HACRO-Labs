/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  // Monthly insurance and maintenance fee collection automation
  // This runs when a payment is created with payment_type = 'insurance'

  const paymentRecord = e.record;
  const paymentType = paymentRecord.get("payment_type");
  const paymentStatus = paymentRecord.get("payment_status");
  const memberId = paymentRecord.get("member_id");
  const amount = paymentRecord.get("amount");

  // Only process insurance payments that are completed
  if (paymentType !== "insurance" || paymentStatus !== "completed") {
    e.next();
    return;
  }

  if (!memberId || !amount) {
    e.next();
    return;
  }

  try {
    // Get member details
    const member = $app.findRecordById("members", memberId);
    if (!member) {
      console.log("Member not found for insurance payment:", memberId);
      e.next();
      return;
    }

    // Create company account transaction record
    const companyTransaction = new Record("company_transactions");
    companyTransaction.set("transaction_type", "insurance_fee");
    companyTransaction.set("amount", amount);
    companyTransaction.set("member_id", memberId);
    companyTransaction.set("description", `Monthly insurance and maintenance fee from ${member.get("first_name")} ${member.get("last_name")}`);
    companyTransaction.set("date", new Date().toISOString());
    companyTransaction.set("payment_id", paymentRecord.id);
    $app.save(companyTransaction);

    // Create contribution history for tracking
    const contributionHistory = new Record("contributions_history");
    contributionHistory.set("member_id", memberId);
    contributionHistory.set("group_id", member.get("group_id"));
    contributionHistory.set("type", "insurance_fee");
    contributionHistory.set("amount", amount);
    contributionHistory.set("date", new Date().toISOString());
    contributionHistory.set("description", "Monthly insurance and maintenance fee");
    contributionHistory.set("balance", 0); // Company account balance tracking would be separate
    $app.save(contributionHistory);

    // Notify member of successful insurance payment
    const notification = new Record("notifications");
    notification.set("member_id", memberId);
    notification.set("type", "insurance_payment");
    notification.set("title", "Insurance Fee Paid");
    notification.set("message", `Your monthly insurance and maintenance fee of KES ${amount.toLocaleString()} has been successfully processed. Thank you for keeping your account active.`);
    notification.set("read_status", false);
    $app.save(notification);

    console.log(`Insurance fee of ${amount} collected from member ${memberId}`);

  } catch (err) {
    console.log("Error in insurance fee collection automation: " + err.message);
  }

  e.next();
}, "payments");