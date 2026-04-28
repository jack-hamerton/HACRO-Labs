# IL & GIL Loan System - Implementation Complete (Frontend)

## ✅ Completed Changes

### 1. **LoanRequestPage.jsx** - Loan Type Selection & Application
**Features:**
- **Loan Type Selection**: Users choose between Individual Loan (IL) or Group Individual Loaning (GIL)
- **Individual Loan (IL)**:
  - Requires 3+ months of savings
  - Member's savings used as collateral
  - Constraint: loan_amount + 2% interest ≤ member_savings
  - All group members vote for approval
  
- **Group Individual Loaning (GIL)**:
  - No 3-month waiting period
  - Select group members as guarantors
  - Each guarantor places collateral amount from their savings
  - Constraint: loan_amount = member_savings + sum(guarantors_collateral)
  - Guarantors confirm collateral amounts

**New Fields in Loan Records:**
- `loan_type` ('IL' or 'GIL')
- `grace_period_end_date` (1 month from loan creation)
- `repayment_start_date` (after grace period)
- `repayment_period` (fixed to 2 months, down from 3)

---

### 2. **LoanVotingPage.jsx** - Separate Approval Workflows

**Individual Loan (IL) Flow:**
- All group members see the loan and vote
- Shows: requested amount, borrower's collateral (savings)
- Vote type: Group approval (all members must approve)

**Group Individual Loaning (GIL) Flow:**
- Only selected guarantors vote
- Shows: loan amount, guarantor's individual collateral amount
- Shows disclaimer: "Your collateral will be deducted from your savings"
- Vote type: Guarantor confirmation
- Button text changes to "Confirm Collateral" instead of "Approve Loan"

**Auto-Approval:**
- When all approvals are confirmed, loan automatically moves to `approved` status

---

### 3. **LoanRepaymentPage.jsx** - Grace Period & 2-Month Repayment

**Grace Period Features:**
- First month is grace period (no penalties)
- Blue alert box shows: "✓ Grace Period Active" or "⚠ Grace Period Ended"
- Shows exact grace period end date

**Repayment Details:**
- Fixed 2-month repayment period (from 3 months)
- Shows repayment deadline
- Displays when penalties will start

**Interest Breakdown Display:**
- Shows 2% flat interest broken down as:
  - **1%** → Company
  - **0.5%** → Group members equally (bounce)
  - **0.5%** → Guarantors equally (bounce) [GIL only]

**Penalties:**
- Only displayed after grace period ends
- Shows cumulative penalty amount (1% per day late)

---

## 📋 What Still Needs Implementation

### 1. **PocketBase Schema Updates**

```sql
-- Add fields to existing 'loans' collection:
- loan_type (select: IL or GIL)
- grace_period_end_date (datetime)
- repayment_start_date (datetime)

-- Create new 'loan_guarantors' collection:
- loan_id (relation to loans)
- member_id (relation to members)
- collateral_amount (number)
- status (select: pending_approval, confirmed, released)

-- Update 'loan_approvals' collection:
- vote_type (select: approval or guarantor_confirmation)
- collateral_amount (number - for GIL)
```

### 2. **Backend Hooks (PocketBase)**

**bonus-distribution.pb.js** - Update Interest Distribution:
```javascript
// When loan is fully repaid, distribute interest:
const interest = loan.amount * 0.02; // 2% flat

if (loan.loan_type === 'IL') {
  // Company: 1%
  createBonus({ type: 'company', amount: interest * 0.50 });
  
  // Group members (equally): 0.5%
  groupMembers.forEach(m => {
    createBonus({ member_id: m.id, amount: interest * 0.25 / groupMembers.length });
  });
} else if (loan.loan_type === 'GIL') {
  // Company: 1%
  createBonus({ type: 'company', amount: interest * 0.50 });
  
  // Group members (equally): 0.5%
  groupMembers.forEach(m => {
    createBonus({ member_id: m.id, amount: interest * 0.25 / groupMembers.length });
  });
  
  // Guarantors (equally): 0.5%
  guarantors.forEach(g => {
    createBonus({ member_id: g.member_id, amount: interest * 0.25 / guarantors.length });
  });
}
```

**penalty-calculation.pb.js** - Add Grace Period Check:
```javascript
// When loan repayment is due and not paid:
if (now > loan.grace_period_end_date) {
  // Apply 1% daily penalty
  penalty = loan.amount * 0.01 * daysPastDue;
  createPenalty({ loan_id: loan.id, amount: penalty });
} else {
  // Grace period active - no penalties
  return;
}
```

**New Hook: collateral-lock.pb.js** - Lock Guarantor Collateral:
```javascript
// When GIL loan is approved:
// For each guarantor, deduct collateral from their savings
guarantors.forEach(g => {
  // Create a "held_collateral" record
  // Deduct from member's available balance
});

// When loan is fully repaid:
// Release collateral back to member's available balance
```

### 3. **Database Modifications to Make**

**Via PocketBase Admin Panel:**

1. **Edit 'loans' collection** → Add fields:
   - `loan_type` (select with options: IL, GIL)
   - `grace_period_end_date` (datetime)
   - `repayment_start_date` (datetime)
   - Change `repayment_period` default from 3 to 2

2. **Create 'loan_guarantors' collection**:
   - `loan_id` (relation to loans)
   - `member_id` (relation to members)
   - `collateral_amount` (number)
   - `status` (select: pending_approval, confirmed, released)

3. **Update 'loan_approvals' collection** → Add fields:
   - `vote_type` (select: approval, guarantor_confirmation)
   - `collateral_amount` (number, optional)

4. **Update 'savings' collection** → Add field:
   - `held_collateral` (number, default 0) - tracks collateral locked in GIL loans

---

## 🔄 Complete Workflow Examples

### Individual Loan (IL) Workflow:
```
1. Member requests IL
2. System checks: saved for 3+ months? ✓
3. System checks: loan + 2% interest ≤ savings? ✓
4. Loan created with loan_type='IL'
5. loan_approvals created for all group members
6. All members vote YES
7. Loan auto-approved
8. Admin disburses
9. Member repays over 2 months
   - Month 1: Grace period (no penalties)
   - Month 2: Repayment due
10. Interest distributed:
    - 1% → Company
    - 0.5% → All group members equally
    - Full balance restored after repay
```

### Group Individual Loaning (GIL) Workflow:
```
1. Member requests GIL
2. System checks: has savings? ✓
3. Member selects guarantors & amounts
4. System validates: requested_amount = member_savings + guarantors_total? ✓
5. Loan created with loan_type='GIL'
6. loan_guarantors created for each guarantor
7. loan_approvals created for each guarantor
8. Each guarantor confirms their collateral
9. Guarantor collateral deducted from their savings (held)
10. Loan auto-approved
11. Admin disburses
12. Member repays over 2 months
    - Month 1: Grace period (no penalties)
    - Month 2: Repayment due
13. Interest distributed:
    - 1% → Company
    - 0.5% → All group members equally
    - 0.5% → Guarantors equally
14. Guarantor collateral released back to their savings
```

---

## 🧪 Testing Checklist

- [ ] IL: Request, approve all members, receive, repay during grace period (no penalty)
- [ ] IL: Request, approve all members, receive, miss repayment (penalty accrues)
- [ ] GIL: Request with guarantors, guarantors confirm collateral, receive, repay
- [ ] GIL: Guarantor collateral deducted from savings on approval
- [ ] GIL: Guarantor collateral released on full repayment
- [ ] Interest splits: 1% company, 0.5% group, 0.5% guarantors (GIL only)
- [ ] Bonus distributions created correctly for each type
- [ ] Grace period enforcement (no penalties first month)
- [ ] 2-month repayment deadline enforced
- [ ] Loan marked as fully_paid when all balance + penalties paid

---

## 📝 Next Steps

1. **Immediate**: Update PocketBase schema (add fields to loans, create loan_guarantors collection)
2. **Short-term**: Update backend hooks for interest distribution and penalties
3. **Testing**: Run through complete workflows for both IL and GIL
4. **Go-live**: Update admin dashboard to show new loan types in management

