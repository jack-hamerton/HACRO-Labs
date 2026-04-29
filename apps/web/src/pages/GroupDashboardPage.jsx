import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Users, Wallet, PiggyBank, MessageSquare, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const GroupDashboardPage = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [groupData, setGroupData] = useState(null);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetchGroupData();
  }, [currentUser]);

  const fetchGroupData = async () => {
    try {
      const memberGroupRecord = await pb.collection('group_members').getFirstListItem(`member_id="${currentUser.id}"`, { expand: 'group_id', $autoCancel: false }).catch(() => null);
      if (!memberGroupRecord) { setLoading(false); return; }

      const group = memberGroupRecord.expand.group_id;
      setGroupData(group);

      const allGroupMembers = await pb.collection('group_members').getFullList({ filter: `group_id="${group.id}"`, expand: 'member_id', $autoCancel: false });
      const groupSavings = await pb.collection('savings').getFullList({ filter: `group_id="${group.id}"`, $autoCancel: false });
      const groupLoans = await pb.collection('loans').getFullList({ filter: `group_id="${group.id}"`, $autoCancel: false });
      const groupRepayments = await pb.collection('loan_repayments').getFullList({ filter: `loan_id.group_id="${group.id}"`, $autoCancel: false });
      const achievements = await pb.collection('achievements').getFullList({ $autoCancel: false });

      const aggregatedMembers = allGroupMembers.map(gm => {
        const member = gm.expand.member_id;
        const memberSavings = groupSavings.filter(s => s.member_id === member.id).reduce((sum, s) => sum + s.amount, 0);
        const memberLoans = groupLoans.filter(l => l.member_id === member.id && (l.status === 'active' || l.status === 'partially_paid'));
        let loanBalance = 0;
        memberLoans.forEach(loan => {
          const totalDue = loan.amount + (loan.amount * (loan.interest_rate / 100));
          const repaid = groupRepayments.filter(r => r.loan_id === loan.id).reduce((sum, r) => sum + r.amount, 0);
          loanBalance += (totalDue - repaid);
        });
        const memberAchs = achievements.filter(a => a.member_id === member.id);

        return { ...member, savingsBalance: memberSavings, loanBalance: Math.max(0, loanBalance), achievements: memberAchs };
      });

      setMembers(aggregatedMembers);
    } catch (error) {
      toast.error('Failed to load group dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
      </div>
    );
  }

  if (!groupData) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-24 text-center">
          <div className="bg-muted/50 rounded-3xl p-12 border border-border">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-foreground mb-2">No Group Assigned</h2>
            <p className="text-muted-foreground mb-8">You haven't been assigned to a savings group yet.</p>
            <Link to="/member-dashboard" className="btn-primary inline-flex items-center">Return to Dashboard</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet><title>{groupData.group_name} - Group Dashboard</title></Helmet>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">{groupData.group_name} - {groupData.region} Region</h1>
              </div>
              <p className="text-muted-foreground flex items-center">
                <span className="font-medium text-foreground mr-2">{members.length} / 15</span> Active Members
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to={`/group/${groupData.id}/chat`} className="btn-outline flex items-center space-x-2">
                <MessageSquare className="w-4 h-4" /><span>Group Chat</span>
              </Link>
              <Link to="/savings-contribution" className="btn-secondary flex items-center space-x-2">
                <PiggyBank className="w-4 h-4" /><span>Contribute</span>
              </Link>
              <Link to="/loan-request" className="btn-primary flex items-center space-x-2">
                <Wallet className="w-4 h-4" /><span>Request Loan</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member) => (
              <div key={member.id} className="dashboard-card flex flex-col h-full">
                <div className="flex items-center space-x-4 mb-6">
                  {member.profile_picture ? (
                    <img src={pb.files.getUrl(member, member.profile_picture)} alt="Profile" className="w-12 h-12 rounded-xl object-cover border border-border flex-shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/20 flex-shrink-0">
                      <span className="text-lg font-bold text-primary">{member.first_name[0]}{member.last_name[0]}</span>
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-semibold text-foreground truncate">
                      {member.first_name} {member.last_name}
                      {member.id === currentUser.id && <span className="ml-2 text-xs font-normal text-muted-foreground">(You)</span>}
                    </h3>
                    <div className="flex gap-1 mt-1">
                      {member.achievements.map(a => (
                        <span key={a.id} className="w-4 h-4 rounded-full bg-yellow-100 flex items-center justify-center" title={a.achievement_type.replace('_', ' ')}>⭐</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-4 mt-auto">
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">Savings Balance</span>
                    <span className="text-sm font-semibold text-[hsl(var(--savings))] tabular-nums">KES {member.savingsBalance.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-muted-foreground">Active Loan</span>
                    <span className={`text-sm font-semibold tabular-nums ${member.loanBalance > 0 ? 'text-[hsl(var(--loans))]' : 'text-muted-foreground'}`}>KES {member.loanBalance.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default GroupDashboardPage;
