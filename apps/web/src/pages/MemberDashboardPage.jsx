import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Wallet, PiggyBank, MessageSquare, AlertCircle, User, Gift, Award, Shield, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import MemberPortalLayout from '@/components/MemberPortalLayout.jsx';

const MemberDashboardPage = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [groupData, setGroupData] = useState(null);
  const [savingsBalance, setSavingsBalance] = useState(0);
  const [loanBalance, setLoanBalance] = useState(0);
  const [collateralBalance, setCollateralBalance] = useState(0);
  const [achievements, setAchievements] = useState([]);
  const [bonuses, setBonuses] = useState([]);

  useEffect(() => {
    fetchMemberData();
  }, [currentUser]);

  const handleLogout = () => {
    logout();
    navigate('/member-login');
  };

  const fetchMemberData = async () => {
    if (!currentUser) return;

    try {
      const memberData = await pb.collection('members').getOne(currentUser.id, { $autoCancel: false });
      setMember(memberData);

      const memberGroup = await pb.collection('group_members').getFirstListItem(`member_id="${currentUser.id}"`, { expand: 'group_id', $autoCancel: false }).catch(() => null);
      if (memberGroup) {
        setGroupData(memberGroup.expand.group_id);
        const savings = await pb.collection('savings').getFullList({ filter: `member_id="${currentUser.id}"`, $autoCancel: false });
        setSavingsBalance(savings.reduce((sum, s) => sum + s.amount, 0));

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

  if (loading) {
    return (
      <div className="admin-theme min-h-screen bg-background flex items-center justify-center px-4 py-20 text-foreground font-sans">
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 border-4 border-[hsl(var(--primary))] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-lg font-medium">Loading your member dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet><title>Member Dashboard - Hacro Labs</title></Helmet>
      <MemberPortalLayout title="Member Dashboard" subtitle="Your member portal home">
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              {member?.profile_picture ? (
                <img src={pb.files.getUrl(member, member.profile_picture)} alt="Profile" className="w-20 h-20 rounded-2xl object-cover border-2 border-border shadow-sm" />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-[hsl(var(--primary)_/_0.12)] flex items-center justify-center border-2 border-border shadow-sm">
                  <User className="w-8 h-8 text-[hsl(var(--primary))]" />
                </div>
              )}
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-1">Welcome back, {member?.first_name}</h2>
                <p className="text-muted-foreground">Member ID: {member?.id}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="btn-outline inline-flex items-center gap-2 self-start lg:self-auto"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>

          <div className="rounded-3xl border border-[hsl(var(--primary)_/_0.16)] bg-[hsl(var(--primary)_/_0.06)] px-6 py-5 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] font-semibold text-[hsl(var(--primary))]">Member Hub</p>
            <p className="mt-2 text-sm text-muted-foreground">Your member dashboard now uses the same green sidebar style as the admin portal.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
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
          </div>

          <div className="space-y-6">
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
        </div>
      </MemberPortalLayout>
    </>
  );
};

export default MemberDashboardPage;
