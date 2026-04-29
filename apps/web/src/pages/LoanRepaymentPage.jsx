import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Wallet, ArrowLeft, Loader2, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const LoanRepaymentPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeLoans, setActiveLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  
  const [formData, setFormData] = useState({
    amount: ''
  });

  useEffect(() => {
    fetchActiveLoans();
  }, [currentUser]);

  const fetchActiveLoans = async () => {
    try {
      const loans = await pb.collection('loans').getFullList({
        filter: `member_id="${currentUser.id}" && (status="active" || status="partially_paid")`,
        sort: 'created_date',
        $autoCancel: false
      });

      const enrichedLoans = await Promise.all(loans.map(async (loan) => {
        const repayments = await pb.collection('loan_repayments').getFullList({
          filter: `loan_id="${loan.id}"`,
          $autoCancel: false
        });

        const totalRepaid = repayments.reduce((sum, r) => sum + r.amount, 0);
        const interestAmount = loan.amount * (loan.interest_rate / 100);
        const totalDue = loan.amount + interestAmount;
        const remainingBalance = totalDue - totalRepaid;

        // Calculate grace period status
        const now = new Date();
        const gracePeriodEnd = new Date(loan.grace_period_end_date || loan.created_date);
        gracePeriodEnd.setMonth(gracePeriodEnd.getMonth() + 1);
        const inGracePeriod = now < gracePeriodEnd;
        const repaymentStart = new Date(loan.repayment_start_date || loan.created_date);
        repaymentStart.setMonth(repaymentStart.getMonth() + 1);
        const repaymentEnd = new Date(repaymentStart);
        repaymentEnd.setMonth(repaymentEnd.getMonth() + 1);

        // Check for penalties
        const penalties = await pb.collection('penalties').getFullList({
          filter: `loan_id="${loan.id}"`,
          $autoCancel: false
        });
        const totalPenalties = penalties.reduce((sum, p) => sum + p.amount, 0);

        return {
          ...loan,
          interestAmount,
          totalDue,
          totalRepaid,
          remainingBalance,
          repayments,
          inGracePeriod,
          repaymentEnd,
          repaymentStart,
          totalPenalties,
          gracePeriodEnd
        };
      }));

      setActiveLoans(enrichedLoans);
      if (enrichedLoans.length > 0) {
        setSelectedLoan(enrichedLoans[0]);
      }
    } catch (error) {
      console.error('Error fetching loans:', error);
      toast.error('Failed to load active loans');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLoan) return;

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid repayment amount');
      return;
    }

    if (amount > selectedLoan.remainingBalance) {
      toast.error(`Amount exceeds remaining balance of KES ${selectedLoan.remainingBalance.toLocaleString()}`);
      return;
    }

    setSubmitting(true);
    try {
      const dateStr = new Date().toISOString();
      const installmentNum = selectedLoan.repayments.length + 1;

      // 1. Create repayment record
      await pb.collection('loan_repayments').create({
        loan_id: selectedLoan.id,
        member_id: currentUser.id,
        amount: amount,
        date: dateStr,
        installment_number: installmentNum
      }, { $autoCancel: false });

      // 2. Create contribution history
      await pb.collection('contributions_history').create({
        member_id: currentUser.id,
        group_id: selectedLoan.group_id,
        type: 'loan_repayment',
        amount: amount,
        date: dateStr,
        description: `Loan Repayment - Installment ${installmentNum}`,
        balance: selectedLoan.remainingBalance - amount
      }, { $autoCancel: false });

      // 3. Update loan status if fully paid
      if (amount >= selectedLoan.remainingBalance) {
        await pb.collection('loans').update(selectedLoan.id, {
          status: 'fully_paid'
        }, { $autoCancel: false });
        toast.success('Congratulations! Loan fully repaid.');
      } else {
        await pb.collection('loans').update(selectedLoan.id, {
          status: 'partially_paid'
        }, { $autoCancel: false });
        toast.success('Repayment recorded successfully.');
      }

      setFormData({ amount: '' });
      fetchActiveLoans(); // Refresh data
    } catch (error) {
      console.error('Repayment error:', error);
      toast.error('Failed to process repayment. Please try again.');
    } finally {
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
        <title>Loan Repayment - Hacro Labs</title>
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
            <h1 className="text-3xl font-bold text-foreground mb-2">Loan Repayment</h1>
            <p className="text-muted-foreground">Manage and repay your active group loans.</p>
          </div>

          {activeLoans.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-12 text-center">
              <Wallet className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h2 className="text-xl font-semibold text-foreground mb-2">No Active Loans</h2>
              <p className="text-muted-foreground">You don't have any active loans requiring repayment at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {/* Loan Details Card */}
                <div className="dashboard-card">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">Loan Details</h2>
                      <p className="text-sm text-muted-foreground">Disbursed on {new Date(selectedLoan.disbursement_date || selectedLoan.created_date).toLocaleDateString()}</p>
                    </div>
                    <span className="badge-loans">Active</span>
                  </div>

                  {/* Grace Period Status */}
                  <div className={`mb-6 p-4 rounded-xl border ${
                    selectedLoan.inGracePeriod 
                      ? 'bg-blue-50 border-blue-200' 
                      : 'bg-orange-50 border-orange-200'
                  }`}>
                    <p className={`text-sm font-medium ${
                      selectedLoan.inGracePeriod 
                        ? 'text-blue-900' 
                        : 'text-orange-900'
                    }`}>
                      {selectedLoan.inGracePeriod ? '✓ Grace Period Active' : '⚠ Grace Period Ended - Repayments Due'}
                    </p>
                    <p className={`text-xs mt-1 ${
                      selectedLoan.inGracePeriod 
                        ? 'text-blue-700' 
                        : 'text-orange-700'
                    }`}>
                      {selectedLoan.inGracePeriod 
                        ? `Grace period ends on ${new Date(selectedLoan.gracePeriodEnd).toLocaleDateString()}. No penalties during this period.`
                        : `Repayment deadline: ${new Date(selectedLoan.repaymentEnd).toLocaleDateString()}`
                      }
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-muted/50 rounded-xl p-4 border border-border/50">
                      <p className="text-xs text-muted-foreground mb-1">Principal Amount</p>
                      <p className="text-lg font-semibold text-foreground tabular-nums">KES {selectedLoan.amount.toLocaleString()}</p>
                    </div>
                    <div className="bg-muted/50 rounded-xl p-4 border border-border/50">
                      <p className="text-xs text-muted-foreground mb-1">Interest (2% Flat)</p>
                      <p className="text-xs text-muted-foreground mt-1">Breakdown:</p>
                      <p className="text-xs text-foreground mt-1 space-y-0.5">
                        <span className="block">• 1% → Company</span>
                        <span className="block">• 0.5% → Group (Bounce)</span>
                        {selectedLoan.loan_type === 'GIL' && <span className="block">• 0.5% → Guarantors</span>}
                      </p>
                    </div>
                    <div className="bg-muted/50 rounded-xl p-4 border border-border/50">
                      <p className="text-xs text-muted-foreground mb-1">Total Repaid</p>
                      <p className="text-lg font-semibold text-[hsl(var(--savings))] tabular-nums">KES {selectedLoan.totalRepaid.toLocaleString()}</p>
                    </div>
                    <div className="bg-[hsl(var(--loans)_/_0.05)] rounded-xl p-4 border border-[hsl(var(--loans)_/_0.2)]">
                      <p className="text-xs text-[hsl(var(--loans))] font-medium mb-1">Remaining Balance</p>
                      <p className="text-xl font-bold text-[hsl(var(--loans))] tabular-nums">KES {selectedLoan.remainingBalance.toLocaleString()}</p>
                    </div>
                  </div>

                  {selectedLoan.totalPenalties > 0 && !selectedLoan.inGracePeriod && (
                    <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <p className="text-xs font-medium text-destructive">Late Payment Penalties: KES {selectedLoan.totalPenalties.toLocaleString()}</p>
                    </div>
                  )}

                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-foreground">Repayment Progress</span>
                      <span className="text-muted-foreground">{Math.round((selectedLoan.totalRepaid / selectedLoan.totalDue) * 100)}%</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[hsl(var(--savings))] transition-all duration-500"
                        style={{ width: `${(selectedLoan.totalRepaid / selectedLoan.totalDue) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Repayment History */}
                <div className="dashboard-card">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Repayment History</h3>
                  {selectedLoan.repayments.length > 0 ? (
                    <div className="space-y-3">
                      {selectedLoan.repayments.map((rep) => (
                        <div key={rep.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg border border-border/50">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-background rounded-full flex items-center justify-center border border-border">
                              <span className="text-xs font-bold text-muted-foreground">#{rep.installment_number}</span>
                            </div>
                            <span className="text-sm font-medium text-foreground">{new Date(rep.date).toLocaleDateString()}</span>
                          </div>
                          <span className="font-semibold text-foreground tabular-nums">KES {rep.amount.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No repayments made yet.</p>
                  )}
                </div>
              </div>

              {/* Payment Form Sidebar */}
              <div className="lg:col-span-1">
                <form onSubmit={handleSubmit} className="form-section sticky top-24">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Make Repayment</h3>
                  
                  <div>
                    <label className="form-label">Amount (KES) <span className="text-destructive">*</span></label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">KES</span>
                      <input
                        type="number"
                        value={formData.amount}
                        onChange={(e) => setFormData({...formData, amount: e.target.value})}
                        className="form-input pl-14 font-mono"
                        placeholder="0.00"
                        min="1"
                        max={selectedLoan.remainingBalance}
                        step="1"
                        required
                      />
                    </div>
                    <div className="flex justify-between mt-2">
                      <button 
                        type="button"
                        onClick={() => setFormData({ amount: selectedLoan.remainingBalance.toString() })}
                        className="text-xs text-primary hover:underline"
                      >
                        Pay Full Balance
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <button 
                      type="submit" 
                      disabled={submitting || selectedLoan.remainingBalance <= 0}
                      className="w-full btn-primary flex items-center justify-center space-x-2"
                    >
                      {submitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <span>Submit Payment</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
};

export default LoanRepaymentPage;
