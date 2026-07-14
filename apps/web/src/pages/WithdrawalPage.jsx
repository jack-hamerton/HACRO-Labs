import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Wallet, CheckCircle2, Clock3, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import MemberPortalLayout from '@/components/MemberPortalLayout.jsx';

const WithdrawalPage = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [member, setMember] = useState(null);
  const [withdrawals, setWithdrawals] = useState([]);
  const [eligibility, setEligibility] = useState(null);

  useEffect(() => {
    if (!currentUser) return;
    fetchData();
  }, [currentUser]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const memberData = await pb.collection('members').getOne(currentUser.id, { $autoCancel: false });
      setMember(memberData);

      const savings = await pb.collection('savings').getFullList({
        filter: `member_id="${currentUser.id}"`,
        $autoCancel: false
      });

      const totalSavings = savings.reduce((sum, item) => sum + Number(item.total_savings ?? item.amount ?? 0), 0);
      const sortedSavings = [...savings].sort((a, b) => new Date(a.date) - new Date(b.date));
      const earliest = sortedSavings[0] ? new Date(sortedSavings[0].date) : new Date();

      let lastWithdrawalDate = null;
      try {
        const previous = await pb.collection('withdrawals').getFullList({
          filter: `member_id="${currentUser.id}" && withdrawal_type="85_percent" && status="approved"`,
          sort: '-created',
          $autoCancel: false
        });
        if (previous.length > 0) {
          lastWithdrawalDate = new Date(previous[0].get('withdrawal_date') || previous[0].created);
        }
      } catch (error) {
        console.warn('Could not load previous withdrawals', error);
      }

      const referenceDate = lastWithdrawalDate || earliest;
      const nextWithdrawalDate = new Date(referenceDate);
      nextWithdrawalDate.setFullYear(nextWithdrawalDate.getFullYear() + 1);
      const now = new Date();
      const isEligible = now >= nextWithdrawalDate;
      const daysUntilEligible = Math.max(0, Math.ceil((nextWithdrawalDate - now) / (1000 * 60 * 60 * 24)));
      const withdrawalAmount = Math.floor(totalSavings * 0.85);
      const carryForward = Math.max(0, totalSavings - withdrawalAmount);

      setEligibility({
        isEligible,
        totalSavings,
        withdrawalAmount,
        carryForward,
        nextWithdrawalDate,
        daysUntilEligible,
      });

      const records = await pb.collection('withdrawals').getFullList({
        filter: `member_id="${currentUser.id}"`,
        sort: '-created',
        $autoCancel: false
      });
      setWithdrawals(records);
    } catch (error) {
      console.error('Failed to load withdrawal data', error);
      toast.error('Unable to load your withdrawal information right now.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async () => {
    if (!currentUser || !eligibility?.isEligible) return;

    try {
      setSubmitting(true);
      await pb.collection('withdrawals').create({
        member_id: currentUser.id,
        withdrawal_type: '85_percent',
        status: 'pending',
        notes: 'Requested from member withdrawal page'
      }, { $autoCancel: false });

      toast.success('Withdrawal request submitted successfully.');
      await fetchData();
    } catch (error) {
      console.error('Withdrawal request failed', error);
      toast.error('Unable to submit your withdrawal request right now.');
    } finally {
      setSubmitting(false);
    }
  };

  const statusMeta = useMemo(() => ({
    pending: { label: 'Pending', icon: Clock3, className: 'bg-amber-100 text-amber-800 border-amber-200' },
    approved: { label: 'Approved', icon: CheckCircle2, className: 'bg-green-100 text-green-800 border-green-200' },
    rejected: { label: 'Rejected', icon: AlertCircle, className: 'bg-red-100 text-red-800 border-red-200' },
    processed: { label: 'Processed', icon: CheckCircle2, className: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  }), []);

  const memberDisplayName = [member?.first_name, member?.middle_name, member?.last_name].filter(Boolean).join(' ') || currentUser?.first_name || currentUser?.email || 'Member';
  const memberDisplayId = member?.member_number || member?.member_id || member?.id || currentUser?.id || 'N/A';

  return (
    <>
      <Helmet><title>Withdrawal - HACRO Hub</title></Helmet>
      <MemberPortalLayout title="Withdrawal" subtitle="Manage your savings withdrawal requests">
        <div className="space-y-6">
          <div className="rounded-3xl border border-border/70 bg-white/85 p-6 shadow-sm backdrop-blur">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[hsl(var(--primary))]">Savings Withdrawal</p>
                <h2 className="mt-2 text-2xl font-semibold text-foreground">Welcome back, {memberDisplayName}</h2>
                <p className="mt-2 text-sm text-muted-foreground">Member ID: {memberDisplayId}</p>
                <p className="mt-2 text-sm text-muted-foreground">Your request will be reviewed by the team and updates will appear here in your portal.</p>
              </div>
              <Link to="/member-dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-[hsl(var(--primary))] hover:underline">
                <ArrowLeft className="h-4 w-4" /> Back to dashboard
              </Link>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="dashboard-card space-y-4">
              <div className="flex items-center gap-2 text-[hsl(var(--primary))]">
                <Wallet className="h-5 w-5" />
                <h3 className="text-lg font-semibold text-foreground">Your withdrawal eligibility</h3>
              </div>

              {loading ? (
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading eligibility details...
                </div>
              ) : eligibility ? (
                <>
                  <div className="rounded-2xl border border-border/70 bg-[hsl(var(--primary)_/_0.06)] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <p className="text-lg font-semibold text-foreground">{eligibility.isEligible ? 'Eligible now' : 'Not yet eligible'}</p>
                      </div>
                      <div className={`rounded-full border px-3 py-1 text-sm font-medium ${eligibility.isEligible ? 'border-green-200 bg-green-100 text-green-800' : 'border-amber-200 bg-amber-100 text-amber-800'}`}>
                        {eligibility.isEligible ? 'Ready' : 'Pending'}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Current savings</p>
                      <p className="mt-2 text-xl font-semibold text-foreground">KES {eligibility.totalSavings.toLocaleString()}</p>
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Available to withdraw</p>
                      <p className="mt-2 text-xl font-semibold text-green-600">KES {eligibility.withdrawalAmount.toLocaleString()}</p>
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Carry forward</p>
                      <p className="mt-2 text-xl font-semibold text-blue-600">KES {eligibility.carryForward.toLocaleString()}</p>
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Next eligible date</p>
                      <p className="mt-2 text-xl font-semibold text-foreground">{eligibility.nextWithdrawalDate.toLocaleDateString('en-KE')}</p>
                    </div>
                  </div>

                  <button
                    onClick={handleRequest}
                    disabled={!eligibility.isEligible || submitting}
                    className="btn-primary w-full sm:w-auto"
                  >
                    {submitting ? 'Submitting request...' : 'Request Withdrawal'}
                  </button>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">No withdrawal eligibility data is available yet.</p>
              )}
            </div>

            <div className="dashboard-card">
              <h3 className="text-lg font-semibold text-foreground">Recent withdrawal requests</h3>
              <div className="mt-4 space-y-3">
                {withdrawals.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No withdrawal requests yet.</p>
                ) : withdrawals.map((item) => {
                  const meta = statusMeta[item.status] || statusMeta.pending;
                  const Icon = meta.icon;
                  return (
                    <div key={item.id} className="rounded-2xl border border-border/70 bg-background/70 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-foreground">{item.withdrawal_type || '85_percent'}</p>
                          <p className="text-xs text-muted-foreground">{new Date(item.created).toLocaleDateString('en-KE')}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${meta.className}`}>
                          <Icon className="h-3.5 w-3.5" />
                          {meta.label}
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground">
                        Amount: KES {Number(item.withdrawal_amount_85 || 0).toLocaleString()}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </MemberPortalLayout>
    </>
  );
};

export default WithdrawalPage;

