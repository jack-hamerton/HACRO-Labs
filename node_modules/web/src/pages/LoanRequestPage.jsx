import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Wallet, ArrowLeft, Loader2, AlertTriangle, Users, User, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const LoanRequestPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loanType, setLoanType] = useState(null); // IL or GIL
  const [eligibility, setEligibility] = useState({ isEligible: false, reason: '', savingsBalance: 0, eligibleForIL: false, eligibleForGIL: true });
  const [groupData, setGroupData] = useState(null);
  const [groupMembers, setGroupMembers] = useState([]);
  const [memberBalances, setMemberBalances] = useState({});
  
  const [formData, setFormData] = useState({
    amount: '',
    purpose: '',
    loanType: 'IL', // Default to IL
    selectedGuarantors: {}, // { memberId: collateralAmount }
  });

  useEffect(() => {
    checkEligibility();
  }, [currentUser]);

  const checkEligibility = async () => {
    try {
      // 1. Get Group and all group members
      const memberGroup = await pb.collection('group_members').getFirstListItem(`member_id="${currentUser.id}"`, {
        expand: 'group_id',
        $autoCancel: false
      });
      setGroupData(memberGroup.expand.group_id);

      // 2. Get all group members with their savings
      const allGroupMembers = await pb.collection('group_members').getFullList({
        filter: `group_id="${memberGroup.group_id}"`,
        expand: 'member_id',
        $autoCancel: false
      });
      setGroupMembers(allGroupMembers);

      // Get savings balance for each group member
      const balances = {};
      for (const gm of allGroupMembers) {
        const savings = await pb.collection('savings').getFullList({
          filter: `member_id="${gm.member_id}"`,
          $autoCancel: false
        });
        balances[gm.member_id] = savings.reduce((sum, s) => sum + s.amount, 0);
      }
      setMemberBalances(balances);

      // 3. Get current user's savings
      const userSavings = await pb.collection('savings').getFullList({
        filter: `member_id="${currentUser.id}"`,
        sort: 'date',
        $autoCancel: false
      });

      const userBalance = userSavings.reduce((sum, s) => sum + s.amount, 0);
      
      if (userSavings.length === 0) {
        setEligibility({ 
          isEligible: false, 
          reason: 'You must have savings to request a loan.', 
          savingsBalance: 0,
          eligibleForIL: false,
          eligibleForGIL: true // Can request GIL immediately with guarantors
        });
        setLoading(false);
        return;
      }

      // Check 3 months rule (for IL)
      const earliestDate = new Date(userSavings[0].date);
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

      const isEligibleForIL = earliestDate <= threeMonthsAgo;

      if (!isEligibleForIL) {
        const requiredDate = new Date(earliestDate);
        requiredDate.setMonth(requiredDate.getMonth() + 3);
      }

      setEligibility({ 
        isEligible: isEligibleForIL, 
        reason: isEligibleForIL ? '' : `You will be eligible for Individual Loans on ${new Date(earliestDate.getTime() + 3*30*24*60*60*1000).toLocaleDateString()}.`, 
        savingsBalance: userBalance,
        eligibleForIL: isEligibleForIL,
        eligibleForGIL: true // Always eligible for GIL with group guarantors
      });

    } catch (error) {
      console.error('Eligibility check error:', error);
      toast.error('Could not verify loan eligibility.');
      navigate('/group-dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount);
    
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid loan amount');
      return;
    }

    // Type-specific validation
    if (loanType === 'IL') {
      // Individual Loan: amount + interest ≤ user's savings
      const interest = amount * 0.02;
      if (amount + interest > eligibility.savingsBalance) {
        toast.error(`Loan amount + 2% interest (${(amount + interest).toLocaleString()}) cannot exceed your savings (${eligibility.savingsBalance.toLocaleString()})`);
        return;
      }
    } else if (loanType === 'GIL') {
      // Group Individual Loan: amount = user's savings + guarantors' collateral
      const selectedGuarantorsArray = Object.entries(formData.selectedGuarantors)
        .filter(([_, amt]) => amt && parseFloat(amt) > 0)
        .map(([id, amt]) => ({ memberId: id, amount: parseFloat(amt) }));

      if (selectedGuarantorsArray.length === 0) {
        toast.error('You must select at least one guarantor for GIL');
        return;
      }

      const guarantorTotal = selectedGuarantorsArray.reduce((sum, g) => sum + g.amount, 0);
      const totalCollateral = eligibility.savingsBalance + guarantorTotal;
      const interest = amount * 0.02;

      if (Math.abs(amount - totalCollateral) > 0.01) { // Allow small floating-point differences
        toast.error(`Loan amount (${amount.toLocaleString()}) must equal your savings (${eligibility.savingsBalance.toLocaleString()}) + guarantors' collateral (${guarantorTotal.toLocaleString()})`);
        return;
      }
    }

    setSubmitting(true);
    try {
      const gracePeriodEnd = new Date();
      gracePeriodEnd.setMonth(gracePeriodEnd.getMonth() + 1);
      const repaymentStart = new Date();
      repaymentStart.setMonth(repaymentStart.getMonth() + 2);

      // 1. Create Loan Record
      const loanData = {
        member_id: currentUser.id,
        group_id: groupData.id,
        amount: amount,
        interest_rate: 2, // 2% flat rate
        repayment_period: 2, // Always 2 months
        loan_type: loanType,
        status: 'pending',
        created_date: new Date().toISOString(),
        purpose: formData.purpose,
        grace_period_end_date: gracePeriodEnd.toISOString(),
        repayment_start_date: repaymentStart.toISOString()
      };

      const loan = await pb.collection('loans').create(loanData, { $autoCancel: false });

      if (loanType === 'IL') {
        // For IL: Create approvals for all group members (they vote)
        const allGroupMembers = await pb.collection('group_members').getFullList({
          filter: `group_id="${groupData.id}"`,
          $autoCancel: false
        });

        const approvalPromises = allGroupMembers.map(gm => 
          pb.collection('loan_approvals').create({
            loan_id: loan.id,
            member_id: gm.member_id,
            approved: false,
            vote_type: 'approval'
          }, { $autoCancel: false })
        );

        await Promise.all(approvalPromises);
      } else if (loanType === 'GIL') {
        // For GIL: Create guarantor records
        const selectedGuarantorsArray = Object.entries(formData.selectedGuarantors)
          .filter(([_, amt]) => amt && parseFloat(amt) > 0)
          .map(([id, amt]) => ({ memberId: id, amount: parseFloat(amt) }));

        const guarantorPromises = selectedGuarantorsArray.map(g => 
          pb.collection('loan_guarantors').create({
            loan_id: loan.id,
            member_id: g.memberId,
            collateral_amount: g.amount,
            status: 'pending_approval'
          }, { $autoCancel: false })
        );

        await Promise.all(guarantorPromises);

        // Also create approval records for guarantors to confirm amounts
        const approvalPromises = selectedGuarantorsArray.map(g =>
          pb.collection('loan_approvals').create({
            loan_id: loan.id,
            member_id: g.memberId,
            approved: false,
            vote_type: 'guarantor_confirmation',
            collateral_amount: g.amount
          }, { $autoCancel: false })
        );

        await Promise.all(approvalPromises);
      }

      toast.success(`${loanType === 'IL' ? 'Individual' : 'Group'} Loan request submitted successfully! Awaiting approval.`);
      navigate('/group-dashboard');
    } catch (error) {
      console.error('Loan submission error:', error);
      toast.error('Failed to submit loan request. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Request Loan - Hacro Labs</title>
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-12">
          <button 
            onClick={() => navigate('/group-dashboard')}
            className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Group
          </button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Request a Loan</h1>
            <p className="text-muted-foreground">Choose between Individual Loan (IL) or Group Individual Loaning (GIL).</p>
          </div>

          {!loanType ? (
            // Loan Type Selection
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Individual Loan Option */}
              <button
                onClick={() => setLoanType('IL')}
                disabled={!eligibility.eligibleForIL}
                className={`p-8 rounded-2xl border-2 transition-all text-left ${
                  eligibility.eligibleForIL
                    ? 'border-[hsl(var(--loans))] bg-[hsl(var(--loans)_/_0.05)] hover:shadow-lg'
                    : 'border-muted opacity-50 cursor-not-allowed'
                }`}
              >
                <User className="w-8 h-8 mb-4 text-[hsl(var(--loans))]" />
                <h2 className="text-2xl font-bold text-foreground mb-3">Individual Loan (IL)</h2>
                <p className="text-muted-foreground mb-6">Borrow using your own savings as collateral.</p>
                <div className="space-y-2 text-sm">
                  <p className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>2-month repayment period with 1-month grace</span>
                  </p>
                  <p className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>2% flat interest rate</span>
                  </p>
                  <p className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Savings + bounce must ≥ loan amount + interest</span>
                  </p>
                </div>
                {!eligibility.eligibleForIL && (
                  <p className="mt-4 text-xs text-orange-600 bg-orange-50 p-2 rounded">
                    {eligibility.reason}
                  </p>
                )}
              </button>

              {/* Group Individual Loaning Option */}
              <button
                onClick={() => setLoanType('GIL')}
                disabled={!eligibility.eligibleForGIL}
                className={`p-8 rounded-2xl border-2 transition-all text-left ${
                  eligibility.eligibleForGIL
                    ? 'border-[hsl(var(--savings))] bg-[hsl(var(--savings)_/_0.05)] hover:shadow-lg'
                    : 'border-muted opacity-50 cursor-not-allowed'
                }`}
              >
                <Users className="w-8 h-8 mb-4 text-[hsl(var(--savings))]" />
                <h2 className="text-2xl font-bold text-foreground mb-3">Group Individual Loaning (GIL)</h2>
                <p className="text-muted-foreground mb-6">Borrow with group members as guarantors.</p>
                <div className="space-y-2 text-sm">
                  <p className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>2-month repayment period with 1-month grace</span>
                  </p>
                  <p className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>2% flat interest rate</span>
                  </p>
                  <p className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>No 3-month savings requirement</span>
                  </p>
                </div>
              </button>
            </div>
          ) : loanType === 'IL' && !eligibility.eligibleForIL ? (
            // IL Not Eligible
            <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-8 text-center">
              <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">Not Eligible for Individual Loan</h2>
              <p className="text-muted-foreground mb-6">{eligibility.reason}</p>
              <div className="bg-background rounded-xl p-4 inline-block border border-border mb-6">
                <p className="text-sm text-muted-foreground mb-1">Current Savings Balance</p>
                <p className="text-xl font-bold text-foreground">KES {eligibility.savingsBalance.toLocaleString()}</p>
              </div>
              <button
                onClick={() => setLoanType(null)}
                className="btn-secondary"
              >
                Try Group Individual Loaning Instead
              </button>
            </div>
          ) : (
            // Loan Form (IL or GIL)
            <>
              <div className="mb-8">
                <button
                  onClick={() => setLoanType(null)}
                  className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Change loan type
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="stat-card bg-[hsl(var(--savings)_/_0.05)] border-[hsl(var(--savings)_/_0.1)]">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Your Savings Balance</h3>
                  <p className="text-2xl font-bold text-[hsl(var(--savings))] tabular-nums">
                    KES {eligibility.savingsBalance.toLocaleString()}
                  </p>
                </div>
                {loanType === 'GIL' && (
                  <div className="stat-card bg-[hsl(var(--loans)_/_0.05)] border-[hsl(var(--loans)_/_0.1)]">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Guarantors' Collateral Selected</h3>
                    <p className="text-2xl font-bold text-[hsl(var(--loans))] tabular-nums">
                      KES {Object.values(formData.selectedGuarantors).reduce((sum, a) => sum + (parseFloat(a) || 0), 0).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="form-section space-y-6">
                <div>
                  <label className="form-label">Loan Amount (KES) <span className="text-destructive">*</span></label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">KES</span>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      className="form-input pl-14 font-mono text-lg"
                      placeholder="0.00"
                      min="1"
                      step="1"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">2% flat interest rate. With interest, total = {(parseFloat(formData.amount) * 1.02).toLocaleString() || 0}</p>
                </div>

                <div>
                  <label className="form-label">Purpose of Loan <span className="text-destructive">*</span></label>
                  <textarea
                    value={formData.purpose}
                    onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                    className="form-input min-h-[100px] resize-y"
                    placeholder="Briefly describe what the loan is for..."
                    required
                  />
                </div>

                {loanType === 'GIL' && (
                  <div className="border border-border rounded-2xl p-6">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Select Guarantors & Collateral Amounts
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Your savings ({eligibility.savingsBalance.toLocaleString()}) + guarantors' collateral must equal the loan amount requested.
                    </p>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {groupMembers
                        .filter(gm => gm.member_id !== currentUser.id) // Exclude self
                        .map((member) => (
                          <div key={member.id} className="flex items-end gap-3 p-3 bg-muted/50 rounded-lg">
                            <div className="flex-1">
                              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                                {member.expand?.member_id?.name || 'Member'} 
                                <span className="text-muted-foreground ml-1">(Available: KES {memberBalances[member.member_id]?.toLocaleString() || 0})</span>
                              </label>
                              <input
                                type="number"
                                value={formData.selectedGuarantors[member.member_id] || ''}
                                onChange={(e) => {
                                  const newGuarantors = {...formData.selectedGuarantors};
                                  if (e.target.value) {
                                    newGuarantors[member.member_id] = parseFloat(e.target.value);
                                  } else {
                                    delete newGuarantors[member.member_id];
                                  }
                                  setFormData({...formData, selectedGuarantors: newGuarantors});
                                }}
                                className="form-input"
                                placeholder="Collateral amount"
                                min="0"
                                max={memberBalances[member.member_id] || 0}
                                step="1"
                              />
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-border">
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full btn-primary flex items-center justify-center space-x-2 bg-[hsl(var(--loans))] hover:bg-[hsl(var(--loans)_/_0.9)] text-white"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Wallet className="w-5 h-5" />
                        <span>Submit {loanType === 'IL' ? 'Individual' : 'Group'} Loan Request</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
};

export default LoanRequestPage;
