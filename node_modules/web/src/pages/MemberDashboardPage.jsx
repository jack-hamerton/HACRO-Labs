import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, Activity, Users, PiggyBank, Wallet, History, Award, Gift, Shield } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const MemberDashboardPage = () => {
  const { currentUser } = useAuth();
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

        // Fetch collateral commitments
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
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet><title>Member Dashboard - Hacro Labs</title></Helmet>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-6 mb-8">
            {member?.profile_picture ? (
              <img src={pb.files.getUrl(member, member.profile_picture)} alt="Profile" className="w-20 h-20 rounded-2xl object-cover border-2 border-border shadow-sm" />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center border-2 border-border shadow-sm">
                <User className="w-8 h-8 text-muted-foreground" />
              </div>
            )}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-1">Welcome back, {member?.first_name}</h1>
              <p className="text-muted-foreground">Member ID: {member?.id}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {groupData && (
                <div className="dashboard-card bg-gradient-to-br from-muted/30 to-background">
                  <h2 className="text-xl font-semibold text-foreground mb-6">Savings & Loans</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-[hsl(var(--savings)_/_0.05)] border border-[hsl(var(--savings)_/_0.1)] rounded-xl p-5">
                      <div className="flex items-center space-x-2 mb-2">
                        <PiggyBank className="w-5 h-5 text-[hsl(var(--savings))]" />
                        <span className="text-sm font-medium text-muted-foreground">Savings Balance</span>
                      </div>
                      <p className="text-2xl font-bold text-[hsl(var(--savings))] tabular-nums">KES {savingsBalance.toLocaleString()}</p>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-900/50 rounded-xl p-5">
                      <div className="flex items-center space-x-2 mb-2">
                        <Shield className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        <span className="text-sm font-medium text-muted-foreground">Collateral Committed</span>
                      </div>
                      <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 tabular-nums">KES {collateralBalance.toLocaleString()}</p>
                      <p className="text-xs text-orange-700 dark:text-orange-500/80 mt-1">Locked as loan guarantees</p>
                    </div>
                    <div className="bg-[hsl(var(--loans)_/_0.05)] border border-[hsl(var(--loans)_/_0.1)] rounded-xl p-5">
                      <div className="flex items-center space-x-2 mb-2">
                        <Wallet className="w-5 h-5 text-[hsl(var(--loans))]" />
                        <span className="text-sm font-medium text-muted-foreground">Active Loan Balance</span>
                      </div>
                      <p className="text-2xl font-bold text-[hsl(var(--loans))] tabular-nums">KES {loanBalance.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Link to="/savings-contribution" className="btn-secondary text-sm py-2 px-4">Make Contribution</Link>
                    <Link to="/loan-request" className="btn-secondary text-sm py-2 px-4">Request Loan</Link>
                    <Link to="/loan-repayment" className="btn-secondary text-sm py-2 px-4">Repay Loan</Link>
                  </div>
                </div>
              )}

              <div className="dashboard-card">
                <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center"><Gift className="w-5 h-5 mr-2 text-primary" /> Bonuses Earned</h2>
                {bonuses.length > 0 ? (
                  <div className="space-y-3">
                    {bonuses.map(b => (
                      <div key={b.id} className="flex justify-between items-center p-4 bg-muted/50 rounded-xl border border-border/50">
                        <div>
                          <p className="font-medium text-foreground capitalize">{b.bonus_type.replace('_', ' ')}</p>
                          <p className="text-xs text-muted-foreground">{new Date(b.created).toLocaleDateString()}</p>
                        </div>
                        <span className="font-bold text-primary">KES {b.amount.toLocaleString()}</span>
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
                <h3 className="font-semibold text-foreground mb-4 flex items-center"><Award className="w-5 h-5 mr-2 text-yellow-500" /> Achievements</h3>
                {achievements.length > 0 ? (
                  <div className="space-y-3">
                    {achievements.map(a => (
                      <div key={a.id} className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/50 rounded-xl">
                        <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/50 rounded-full flex items-center justify-center">
                          <Award className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-yellow-800 dark:text-yellow-300 capitalize">{a.achievement_type.replace('_', ' ')}</p>
                          <p className="text-xs text-yellow-700 dark:text-yellow-500/80">{new Date(a.created).toLocaleDateString()}</p>
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
        </div>
        <Footer />
      </div>
    </>
  );
};

export default MemberDashboardPage;