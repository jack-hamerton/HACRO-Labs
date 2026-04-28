import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import { Wallet, ArrowLeft, Loader2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const LoanRepaymentTracker = () => {
  const { loanId } = useParams();
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [loan, setLoan] = useState(null);
  const [repayments, setRepayments] = useState([]);
  const [penalties, setPenalties] = useState([]);

  useEffect(() => {
    fetchLoanDetails();
  }, [loanId]);

  const fetchLoanDetails = async () => {
    try {
      const loanData = await pb.collection('loans').getOne(loanId, { $autoCancel: false });
      setLoan(loanData);

      const reps = await pb.collection('loan_repayments').getFullList({
        filter: `loan_id="${loanId}"`,
        sort: 'date',
        $autoCancel: false
      });
      setRepayments(reps);

      const pens = await pb.collection('penalties').getFullList({
        filter: `loan_id="${loanId}"`,
        sort: 'date_applied',
        $autoCancel: false
      });
      setPenalties(pens);
    } catch (error) {
      toast.error('Failed to load loan details');
      navigate('/member-dashboard');
    } finally {
      setLoading(false);
    }
  };

  const waivePenalty = async (penaltyId) => {
    if (!isAdmin) return;
    try {
      await pb.collection('penalties').update(penaltyId, {
        waived: true,
        waived_by: currentUser.id,
        waived_reason: 'Admin override'
      }, { $autoCancel: false });
      toast.success('Penalty waived');
      fetchLoanDetails();
    } catch (error) {
      toast.error('Failed to waive penalty');
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

  const totalRepaid = repayments.reduce((sum, r) => sum + r.amount, 0);
  const totalPenalties = penalties.filter(p => !p.waived).reduce((sum, p) => sum + p.amount, 0);
  const totalDue = loan.amount + (loan.amount * (loan.interest_rate / 100)) + totalPenalties;
  const remaining = totalDue - totalRepaid;

  return (
    <>
      <Helmet><title>Loan Tracker - Hacro Labs</title></Helmet>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-12">
          <button onClick={() => navigate(-1)} className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Loan Repayment Tracker</h1>
            <p className="text-muted-foreground">Monitor your loan progress and penalties.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="stat-card">
              <p className="text-sm text-muted-foreground mb-1">Total Due (inc. Interest)</p>
              <p className="text-2xl font-bold text-foreground">KES {(loan.amount * 1.02).toLocaleString()}</p>
            </div>
            <div className="stat-card bg-destructive/5 border-destructive/20">
              <p className="text-sm text-destructive mb-1">Active Penalties</p>
              <p className="text-2xl font-bold text-destructive">KES {totalPenalties.toLocaleString()}</p>
            </div>
            <div className="stat-card bg-[hsl(var(--loans)_/_0.05)] border-[hsl(var(--loans)_/_0.2)]">
              <p className="text-sm text-[hsl(var(--loans))] mb-1">Remaining Balance</p>
              <p className="text-2xl font-bold text-[hsl(var(--loans))]">KES {remaining.toLocaleString()}</p>
            </div>
          </div>

          <div className="dashboard-card mb-8">
            <h3 className="text-lg font-semibold mb-4">Penalties History</h3>
            {penalties.length === 0 ? (
              <p className="text-sm text-muted-foreground">No penalties applied.</p>
            ) : (
              <div className="space-y-3">
                {penalties.map(p => (
                  <div key={p.id} className={`p-4 rounded-xl border flex justify-between items-center ${p.waived ? 'bg-muted/50 border-border opacity-60' : 'bg-destructive/5 border-destructive/20'}`}>
                    <div>
                      <p className="font-medium text-foreground">{p.reason}</p>
                      <p className="text-xs text-muted-foreground">{new Date(p.date_applied).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`font-bold ${p.waived ? 'line-through text-muted-foreground' : 'text-destructive'}`}>KES {p.amount}</span>
                      {isAdmin && !p.waived && (
                        <button onClick={() => waivePenalty(p.id)} className="text-xs bg-background border border-border px-2 py-1 rounded hover:bg-muted">Waive</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default LoanRepaymentTracker;