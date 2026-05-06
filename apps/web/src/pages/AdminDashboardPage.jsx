import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Users, LayoutGrid, PiggyBank, Wallet, Clock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import AdminLayout from '@/components/AdminLayout.jsx';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Set default stats with 0 values - data can be loaded from API later
        setStats({
          members: 0,
          groups: 0,
          savings: 0,
          loans: 0,
          pendingApprovals: 0
        });

        // Try to fetch actual stats
        try {
          const mems = await pb.collection('members').getList(1, 1, { $autoCancel: false });
          const grps = await pb.collection('groups').getList(1, 1, { $autoCancel: false });
          const savs = await pb.collection('savings').getFullList({ $autoCancel: false });
          const loans = await pb.collection('loans').getFullList({ filter: 'status="active" || status="partially_paid" || status="approved"', $autoCancel: false });
          const approvals = await pb.collection('loan_approvals').getList(1, 1, { filter: 'approved=false', $autoCancel: false });
          
          setStats({
            members: mems.totalItems,
            groups: grps.totalItems,
            savings: savs.reduce((a,b)=>a+b.amount, 0),
            loans: loans.reduce((a,b)=>a+b.amount, 0),
            pendingApprovals: approvals.totalItems
          });
        } catch (dataErr) {
          console.warn('Could not fetch detailed stats:', dataErr.message);
          // Keep default stats
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    { title: 'Total Members', value: stats.members, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Active Groups', value: stats.groups, icon: LayoutGrid, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { title: 'Total Savings', value: `KES ${stats.savings.toLocaleString()}`, icon: PiggyBank, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Active Loans Vol.', value: `KES ${stats.loans.toLocaleString()}`, icon: Wallet, color: 'text-orange-600', bg: 'bg-orange-50' },
    { title: 'Pending Votes', value: stats.pendingApprovals, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <AdminLayout>
      <Helmet><title>Admin Dashboard - Hacro Labs</title></Helmet>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">System Overview</h2>
          <p className="text-slate-500 mt-1">High-level metrics for the Hacro Labs platform.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((card, i) => (
            <div key={i} className="admin-stat-card bg-white flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl ${card.bg} flex items-center justify-center shrink-0`}>
                <card.icon className={`w-7 h-7 ${card.color}`} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">{card.title}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">{card.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Getting Started as Admin</h3>
          <p className="text-slate-600 leading-relaxed mb-6 max-w-3xl">
            Welcome to the new management portal. Use the sidebar to navigate between managing users, configuring system parameters, and viewing comprehensive activity logs. Your session is monitored for security and will auto-expire after 30 minutes of inactivity.
          </p>
          <div className="flex gap-4">
             <a href="/analytics" className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">View Analytics</a>
             <a href="/admin-company-accounts" className="px-5 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors">Company Accounts</a>
             <a href="/admin-activity-log" className="px-5 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors">Review Activity Log</a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
