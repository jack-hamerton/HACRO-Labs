import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Loader2, Users, PiggyBank, Wallet, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import apiServerClient from '@/lib/apiServerClient.js';
import AdminLayout from '@/components/AdminLayout.jsx';

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

const AnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalSavings: 0,
    totalLoans: 0,
    activeLoans: 0,
    defaultRate: '0%'
  });
  const [groupData, setGroupData] = useState([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await apiServerClient.fetch('/admin/analytics', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error('Failed to load analytics');
      }
      const data = await response.json();
      setStats(data.stats);
      setGroupData(data.groupData || []);
    } catch (error) {
      console.error('Analytics error:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <Helmet><title>Analytics Dashboard - Admin</title></Helmet>

      <div className="max-w-7xl mx-auto w-full px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">System-wide financial metrics and group performance.</p>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="stat-card">
                <Users className="w-6 h-6 text-primary mb-2" />
                <p className="text-sm text-muted-foreground">Total Members</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalMembers ?? 0}</p>
              </div>
              <div className="stat-card">
                <PiggyBank className="w-6 h-6 text-[hsl(var(--savings))] mb-2" />
                <p className="text-sm text-muted-foreground">Total Savings</p>
                <p className="text-2xl font-bold text-[hsl(var(--savings))]">KES {(stats.totalSavings ?? 0).toLocaleString()}</p>
              </div>
              <div className="stat-card">
                <Wallet className="w-6 h-6 text-[hsl(var(--loans))] mb-2" />
                <p className="text-sm text-muted-foreground">Total Loans Disbursed</p>
                <p className="text-2xl font-bold text-[hsl(var(--loans))]">KES {(stats.totalLoans ?? 0).toLocaleString()}</p>
              </div>
              <div className="stat-card">
                <AlertTriangle className="w-6 h-6 text-destructive mb-2" />
                <p className="text-sm text-muted-foreground">Default Rate</p>
                <p className="text-2xl font-bold text-destructive">{stats.defaultRate ?? '0%'}</p>
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
                      <Pie data={groupData} dataKey="loans" nameKey="name" cx="50%" cy="50%" outerRadius={groupData.length > 0 ? 100 : 0} label>
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
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AnalyticsDashboard;
