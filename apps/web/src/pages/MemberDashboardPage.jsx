import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Wallet, PiggyBank, MessageSquare, AlertCircle, User, Gift, Award, Shield } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import MemberPortalLayout from '@/components/MemberPortalLayout.jsx';

const MemberDashboardPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [groupData, setGroupData] = useState(null);
  const [savingsBalance, setSavingsBalance] = useState(0);
  const [loanBalance, setLoanBalance] = useState(0);
  const [collateralBalance, setCollateralBalance] = useState(0);
  const [achievements, setAchievements] = useState([]);
  const [bonuses, setBonuses] = useState([]);
  const [withdrawalEligibility, setWithdrawalEligibility] = useState(null);
  const [earliestSavingsDate, setEarliestSavingsDate] = useState(null);
  const [submittingWithdrawal, setSubmittingWithdrawal] = useState(false);

  useEffect(() => {
    fetchMemberData();
  }, [currentUser]);

  const fetchMemberData = async () => {
    if (!currentUser) return;

    try {
      const memberData = await pb.collection('members').getOne(currentUser.id, { $autoCancel: false });
      setMember(memberData);

      const memberGroup = await pb.collection('group_members').getFirstListItem(`member_id="${currentUser.id}"`, { expand: 'group_id', $autoCancel: false }).catch(() => null);
      if (memberGroup) {
        setGroupData(memberGroup.expand.group_id);
        const savings = await pb.collection('savings').getFullList({ filter: `member_id="${currentUser.id}"`, $autoCancel: false });
        const totalSavingsAmount = savings.reduce((sum, s) => sum + Number(s.total_savings ?? s.amount ?? 0), 0);
        setSavingsBalance(totalSavingsAmount);

        

        if (savings.length > 0) {
          

          const sortedSavings = [...savings].sort((a, b) => new Date(a.date) - new Date(b.date));
          const earliest = new Date(sortedSavings[0].date);
          setEarliestSavingsDate(earliest);

          

          let lastWithdrawalDate = null;
          try {
            const withdrawals = await pb.collection('withdrawals').getFullList({
              filter: `member_id="${currentUser.id}" && withdrawal_type="85_percent" && status="approved"`,
              sort: '-created',
              $autoCancel: false
            });
            if (withdrawals.length > 0) {
              lastWithdrawalDate = new Date(withdrawals[0].get('withdrawal_date'));
            }
          } catch (e) {
            

          }

          const referenceDate = lastWithdrawalDate || earliest;
          const nextWithdrawalDate = new Date(referenceDate);
          nextWithdrawalDate.setFullYear(nextWithdrawalDate.getFullYear() + 1);
          const now = new Date();
          const isEligible = now >= nextWithdrawalDate;
          const daysUntilEligible = Math.ceil((nextWithdrawalDate - now) / (1000 * 60 * 60 * 24));

          const currentSavings = totalSavingsAmount;
          const withdrawalAmount = Math.floor(currentSavings * 0.85);
          const carryForward = currentSavings - withdrawalAmount;

          setWithdrawalEligibility({
            isEligible,
            nextWithdrawalDate,
            daysUntilEligible: Math.max(0, daysUntilEligible),
            totalSavings: currentSavings,
            withdrawalAmount,
            carryForward,
            lastWithdrawalDate
          });
        }

        const collateralRecords = await pb.collection('loan_guarantors').getFullList({
          filter: `guarantor_id="${currentUser.id}" && (status="acknowledged" || status="active")`,
          $autoCancel: false
        });
        const totalCollateral = collateralRecords.reduce((sum, c) => sum + (c.collateral_amount || 0), 0);
        setCollateralBalance(totalCollateral);

        const loans = await pb.collection('loans').getFullList({ filter: `member_id="${currentUser.id}" && (status="active" || status="partially_paid")`, $autoCancel: false });
        let totalLoanBal = 0;
        for (const loan of loans) {
          const repayments = await pb.collection('loan_repayments').getFullList({ filter: `loan_id="${loan.id}"`, $autoCancel: false });
          const repaid = repayments.reduce((sum, r) => sum + r.amount, 0);
          const due = loan.amount + (loan.amount * (loan.interest_rate / 100));
          totalLoanBal += (due - repaid);
        }
        setLoanBalance(Math.max(0, totalLoanBal));
      }

      const achs = await pb.collection('achievements').getFullList({ filter: `member_id="${currentUser.id}"`, $autoCancel: false });
      setAchievements(achs);

      const bons = await pb.collection('bonuses').getFullList({ filter: `member_id="${currentUser.id}"`, sort: '-created', $autoCancel: false });
      setBonuses(bons);
    } catch (error) {
      toast.error('Failed to load member data');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawalRequest = async () => {
    if (!currentUser || !withdrawalEligibility?.isEligible) return;

    try {
      setSubmittingWithdrawal(true);
      await pb.collection('withdrawals').create({
        member_id: currentUser.id,
        withdrawal_type: '85_percent',
        status: 'pending',
        notes: 'Requested from member dashboard'
      }, { $autoCancel: false });

      toast.success('Withdrawal request submitted for admin review.');
      await fetchMemberData();
    } catch (error) {
      console.error('Withdrawal request failed', error);
      toast.error('Unable to submit withdrawal request right now.');
    } finally {
      setSubmittingWithdrawal(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-theme min-h-screen bg-background flex items-center justify-center px-4 py-20 text-foreground font-sans">
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 border-4 border-[hsl(var(--primary))] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-lg font-medium">Loading your member dashboardâ€¦</p>
        </div>
      </div>
    );
  }

  const memberDisplayName = [member?.first_name, member?.middle_name, member?.last_name].filter(Boolean).join(' ') || [currentUser?.first_name, currentUser?.last_name].filter(Boolean).join(' ') || currentUser?.email || 'Member';
  const memberDisplayId = member?.member_number || member?.member_id || member?.id || currentUser?.id || 'N/A';

  return (
    <>
      <Helmet><title>Member Dashboard - HACRO Hub</title></Helmet>
      <MemberPortalLayout title="Member Dashboard" subtitle="Your member portal home">
        <div className="mb-5 rounded-[30px] border border-slate-200/70 bg-gradient-to-br from-slate-950 via-emerald-900 to-cyan-700 p-4 text-white shadow-[0_25px_60px_-25px_rgba(2,6,23,0.8)] md:hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-emerald-200">Member vault</p>
              <p className="mt-2 text-3xl font-semibold">KES {savingsBalance.toLocaleString()}</p>
              <p className="mt-1 text-sm text-emerald-100/80">Live savings balance</p>
            </div>
            <div className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-100">
              Live
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur">
              <p className="text-[10px] uppercase tracking-[0.3em] text-emerald-100/80">Collateral</p>
              <p className="mt-1 text-lg font-semibold">KES {collateralBalance.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur">
              <p className="text-[10px] uppercase tracking-[0.3em] text-emerald-100/80">Loans</p>
              <p className="mt-1 text-lg font-semibold">KES {loanBalance.toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link to="/savings-contribution" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900">Top up</Link>
            <Link to="/withdrawal" className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white">Withdraw</Link>
          </div>
        </div>

        <div className="mb-8 hidden rounded-[28px] border border-[hsl(var(--primary)_/_0.16)] bg-gradient-to-br from-[hsl(var(--primary)_/_0.14)] via-white to-[hsl(var(--primary)_/_0.05)] p-6 shadow-sm sm:p-8 md:flex">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-4">
              {member?.profile_picture ? (
                <img src={pb.files.getUrl(member, member.profile_picture)} alt="Profile" className="w-20 h-20 rounded-2xl object-cover border-2 border-border shadow-sm" />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-[hsl(var(--primary)_/_0.12)] flex items-center justify-center border-2 border-border shadow-sm">
                  <User className="w-8 h-8 text-[hsl(var(--primary))]" />
                </div>
              )}
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[hsl(var(--primary))]">Member Hub</p>
                <h2 className="text-3xl font-bold text-foreground mt-1">Welcome back</h2>
                <p className="text-2xl font-semibold text-foreground mt-1">{memberDisplayName}</p>
                <p className="text-muted-foreground mt-1">Member ID: {memberDisplayId}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/savings-contribution" className="btn-primary text-sm py-2.5 px-4">Make Contribution</Link>
              <Link to="/loan-request" className="btn-outline text-sm py-2.5 px-4">Request Loan</Link>
              <Link to="/withdrawal" className="btn-outline text-sm py-2.5 px-4">Withdrawal</Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.55fr_0.95fr] gap-8">
          <div className="space-y-6">
            {groupData && (
              <div className="dashboard-card bg-gradient-to-br from-muted/30 to-background">
                <h2 className="text-xl font-semibold text-foreground mb-6">Savings & Loans</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-[hsl(var(--primary)_/_0.08)] border border-[hsl(var(--primary)_/_0.16)] rounded-xl p-5">
                    <div className="flex items-center space-x-2 mb-2">
                      <PiggyBank className="w-5 h-5 text-[hsl(var(--primary))]" />
                      <span className="text-sm font-medium text-muted-foreground">Savings Balance</span>
                    </div>
                    <p className="text-2xl font-bold text-[hsl(var(--primary))] tabular-nums">KES {savingsBalance.toLocaleString()}</p>
                  </div>
                  <div className="bg-[hsl(var(--primary)_/_0.06)] border border-[hsl(var(--primary)_/_0.12)] rounded-xl p-5">
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield className="w-5 h-5 text-[hsl(var(--primary))]" />
                      <span className="text-sm font-medium text-muted-foreground">Collateral Committed</span>
                    </div>
                    <p className="text-2xl font-bold text-[hsl(var(--primary))] tabular-nums">KES {collateralBalance.toLocaleString()}</p>
                    <p className="text-xs text-[hsl(var(--primary)_/_0.8)] mt-1">Locked as loan guarantees</p>
                  </div>
                  <div className="bg-[hsl(var(--primary)_/_0.08)] border border-[hsl(var(--primary)_/_0.16)] rounded-xl p-5">
                    <div className="flex items-center space-x-2 mb-2">
                      <Wallet className="w-5 h-5 text-[hsl(var(--primary))]" />
                      <span className="text-sm font-medium text-muted-foreground">Active Loan Balance</span>
                    </div>
                    <p className="text-2xl font-bold text-[hsl(var(--primary))] tabular-nums">KES {loanBalance.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link to="/savings-contribution" className="btn-primary text-sm py-2 px-4">Make Contribution</Link>
                  <Link to="/loan-request" className="btn-primary text-sm py-2 px-4">Request Loan</Link>
                  <Link to="/loan-repayment" className="btn-primary text-sm py-2 px-4">Repay Loan</Link>
                </div>
              </div>
            )}

            {withdrawalEligibility && (
              <div className={`dashboard-card border-2 ${withdrawalEligibility.isEligible ? 'border-green-400 bg-green-50 dark:bg-green-950/20' : 'border-amber-400 bg-amber-50 dark:bg-amber-950/20'}`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-1">ðŸ’° 12-Month Savings Withdrawal Cycle</h2>
                    <p className="text-sm text-muted-foreground">Annual withdrawal eligibility status</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${withdrawalEligibility.isEligible ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200' : 'bg-amber-200 text-amber-800 dark:bg-amber-800 dark:text-amber-200'}`}>
                    {withdrawalEligibility.isEligible ? 'âœ“ Eligible' : 'â³ Not Yet'}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  <div className="bg-background/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Current Savings</p>
                    <p className="text-lg font-bold text-foreground">KES {withdrawalEligibility.totalSavings.toLocaleString()}</p>
                  </div>
                  <div className="bg-background/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Can Withdraw (85%)</p>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">KES {withdrawalEligibility.withdrawalAmount.toLocaleString()}</p>
                  </div>
                  <div className="bg-background/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Carry Forward (15%)</p>
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">KES {withdrawalEligibility.carryForward.toLocaleString()}</p>
                  </div>
                  <div className="bg-background/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">
                      {withdrawalEligibility.isEligible ? 'Eligible Since' : 'Eligible In'}
                    </p>
                    <p className="text-lg font-bold text-foreground">
                      {withdrawalEligibility.isEligible ? 'NOW' : `${withdrawalEligibility.daysUntilEligible}d`}
                    </p>
                  </div>
                </div>

                <div className="bg-background/50 rounded-lg p-3 mb-4 text-sm">
                  <p className="text-muted-foreground">
                    <strong>Next eligible date:</strong> {withdrawalEligibility.nextWithdrawalDate.toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  {withdrawalEligibility.lastWithdrawalDate && (
                    <p className="text-muted-foreground mt-1">
                      <strong>Last withdrawal:</strong> {new Date(withdrawalEligibility.lastWithdrawalDate).toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  )}
                </div>

                <div className="text-sm text-muted-foreground bg-background/50 rounded-lg p-3 mb-4 border-l-4 border-blue-500">
                  <p className="font-semibold text-foreground mb-1">ðŸ“‹ How it works:</p>
                  <ul className="space-y-1 text-xs">
                    <li>â€¢ After 12 months of savings, you become eligible to withdraw 85% of your total savings</li>
                    <li>â€¢ The remaining 15% is automatically carried forward to start your next 12-month cycle</li>
                    <li>â€¢ This cycle repeats annually, helping you build sustainable long-term savings</li>
                  </ul>
                </div>

                {withdrawalEligibility.isEligible && (
                  <button
                    onClick={handleWithdrawalRequest}
                    disabled={submittingWithdrawal}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-400 text-white font-medium py-2 rounded-lg transition-colors"
                  >
                    {submittingWithdrawal ? 'Submitting request...' : 'Request Withdrawal Now'}
                  </button>
                )}
              </div>
            )}

            <div className="dashboard-card">
              <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center"><Gift className="w-5 h-5 mr-2 text-[hsl(var(--primary))]" /> Bonuses Earned</h2>
              {bonuses.length > 0 ? (
                <div className="space-y-3">
                  {bonuses.map(b => (
                    <div key={b.id} className="flex justify-between items-center p-4 bg-[hsl(var(--primary)_/_0.08)] rounded-xl border border-[hsl(var(--primary)_/_0.12)]">
                      <div>
                        <p className="font-medium text-foreground capitalize">{b.bonus_type.replace('_', ' ')}</p>
                        <p className="text-xs text-muted-foreground">{new Date(b.created).toLocaleDateString()}</p>
                      </div>
                      <span className="font-bold text-[hsl(var(--primary))]">KES {b.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No bonuses earned yet.</p>
              )}
            </div>

            <div className="dashboard-card">
              <h3 className="font-semibold text-foreground mb-4 flex items-center"><Award className="w-5 h-5 mr-2 text-[hsl(var(--primary))]" /> Achievements</h3>
              {achievements.length > 0 ? (
                <div className="space-y-3">
                  {achievements.map(a => (
                    <div key={a.id} className="flex items-center gap-3 p-3 bg-[hsl(var(--primary)_/_0.08)] border border-[hsl(var(--primary)_/_0.12)] rounded-xl">
                      <div className="w-10 h-10 bg-[hsl(var(--primary)_/_0.14)] rounded-full flex items-center justify-center">
                        <Award className="w-5 h-5 text-[hsl(var(--primary))]" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground capitalize">{a.achievement_type.replace('_', ' ')}</p>
                        <p className="text-xs text-muted-foreground">{new Date(a.created).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Keep saving to earn badges!</p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="dashboard-card">
              <h3 className="font-semibold text-foreground mb-4 flex items-center"><Shield className="w-5 h-5 mr-2 text-[hsl(var(--primary))]" /> Quick Actions</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <Link to="/group-dashboard" className="rounded-2xl border border-border/70 bg-[hsl(var(--primary)_/_0.06)] p-4 transition hover:border-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)_/_0.10)]">
                  <p className="font-semibold text-foreground">My Group</p>
                  <p className="text-sm text-muted-foreground mt-1">See your group activity and updates</p>
                </Link>
                <Link to="/notifications" className="rounded-2xl border border-border/70 bg-[hsl(var(--primary)_/_0.06)] p-4 transition hover:border-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)_/_0.10)]">
                  <p className="font-semibold text-foreground">Notifications</p>
                  <p className="text-sm text-muted-foreground mt-1">Stay updated on approvals and messages</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </MemberPortalLayout>
    </>
  );
};

export default MemberDashboardPage;

