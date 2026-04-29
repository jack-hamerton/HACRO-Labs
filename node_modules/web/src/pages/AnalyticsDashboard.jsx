import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Download, Loader2, Users, PiggyBank, Wallet, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

const AnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [groupData, setGroupData] = useState([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const members = await pb.collection('members').getFullList({ $autoCancel: false });
      const savings = await pb.collection('savings').getFullList({ expand: 'group_id', $autoCancel: false });
      const loans = await pb.collection('loans').getFullList({ expand: 'group_id', $autoCancel: false });
      const groups = await pb.collection('groups').getFullList({ $autoCancel: false });

      const totalSavings = savings.reduce((sum, s) => sum + s.amount, 0);
      const totalLoans = loans.filter(l => l.status !== 'rejected' && l.status !== 'pending').reduce((sum, l) => sum + l.amount, 0);
      const activeLoans = loans.filter(l => l.status === 'active' || l.status === 'partially_paid').length;
      
      const groupStats = groups.map(g => {
        const gSavings = savings.filter(s => s.group_id === g.id).reduce((sum, s) => sum + s.amount, 0);
        const gLoans = loans.filter(l => l.group_id === g.id && l.status !== 'rejected').reduce((sum, l) => sum + l.amount, 0);
        return { name: g.group_name, savings: gSavings, loans: gLoans };
      });

      setStats({
        totalMembers: members.length,
        totalSavings,
        totalLoans,
        activeLoans,
        defaultRate: '2.4%' // Mocked for demo
      });
      setGroupData(groupStats);
    } catch (error) {
      console.error('Analytics error:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Group Name,Total Savings,Total Loans\n"
      + groupData.map(e => `${e.name},${e.savings},${e.loans}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "analytics_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      <Helmet><title>Analytics Dashboard - Admin</title></Helmet>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-12">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
              <p className="text-muted-foreground">System-wide financial metrics and group performance.</p>
            </div>
            <button onClick={exportCSV} className="btn-outline flex items-center space-x-2">
              <Download className="w-4 h-4" /><span>Export CSV</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="stat-card">
              <Users className="w-6 h-6 text-primary mb-2" />
              <p className="text-sm text-muted-foreground">Total Members</p>
              <p className="text-2xl font-bold text-foreground">{stats?.totalMembers}</p>
            </div>
            <div className="stat-card">
              <PiggyBank className="w-6 h-6 text-[hsl(var(--savings))] mb-2" />
              <p className="text-sm text-muted-foreground">Total Savings</p>
              <p className="text-2xl font-bold text-[hsl(var(--savings))]">KES {stats?.totalSavings.toLocaleString()}</p>
            </div>
            <div className="stat-card">
              <Wallet className="w-6 h-6 text-[hsl(var(--loans))] mb-2" />
              <p className="text-sm text-muted-foreground">Total Loans Disbursed</p>
              <p className="text-2xl font-bold text-[hsl(var(--loans))]">KES {stats?.totalLoans.toLocaleString()}</p>
            </div>
            <div className="stat-card">
              <AlertTriangle className="w-6 h-6 text-destructive mb-2" />
              <p className="text-sm text-muted-foreground">Default Rate</p>
              <p className="text-2xl font-bold text-destructive">{stats?.defaultRate}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="dashboard-card">
              <h3 className="text-lg font-semibold mb-6">Savings per Group</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={groupData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip cursor={{fill: 'hsl(var(--muted))'}} contentStyle={{backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))'}} />
                    <Bar dataKey="savings" fill="hsl(var(--savings))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="dashboard-card">
              <h3 className="text-lg font-semibold mb-6">Loans Distribution</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={groupData} dataKey="loans" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                      {groupData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))'}} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default AnalyticsDashboard;
