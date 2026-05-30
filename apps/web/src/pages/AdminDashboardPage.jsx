import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Users, LayoutGrid, PiggyBank, Wallet, Clock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import AdminLayout from '@/components/AdminLayout.jsx';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [companyOverview, setCompanyOverview] = useState(null);

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

    // fetch company overview (admin-protected endpoint)
    const fetchCompanyOverview = async () => {
      try {
        const token = localStorage.getItem('adminToken') || localStorage.getItem('admin_token');
        const res = await fetch('/api/admin/company-accounts', {
          headers: { 'Content-Type': 'application/json', 'Authorization': token ? `Bearer ${token}` : '' }
        });
        if (!res.ok) throw new Error('Failed to load company overview');
        const json = await res.json();
        setCompanyOverview(json.company_overview || json);
      } catch (err) {
        console.warn('Company overview fetch failed', err.message || err);
      }
    };

    fetchCompanyOverview();

    // subscribe to pocketbase realtime events to update overview live
    const onCompanyEvent = async (e) => {
      await fetchCompanyOverview();
    };

    let pollingId = null;
    let subscribed = false;

    try {
      pb.collection('company_transactions').subscribe('*', onCompanyEvent);
      pb.collection('payments').subscribe('*', onCompanyEvent);
      pb.collection('contributions_history').subscribe('*', onCompanyEvent);
      subscribed = true;
    } catch (err) {
      subscribed = false;
    }

    // If subscriptions are not available (local PocketBase missing collections), fall back to polling
    if (!subscribed) {
      pollingId = setInterval(fetchCompanyOverview, 15000); // every 15s
    }

    return () => {
      try { pb.collection('company_transactions').unsubscribe('*'); } catch (e) {}
      try { pb.collection('payments').unsubscribe('*'); } catch (e) {}
      try { pb.collection('contributions_history').unsubscribe('*'); } catch (e) {}
      if (pollingId) clearInterval(pollingId);
    };
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

        {/* Company overview realtime section */}
        <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Company Collections (Realtime)</h3>
          {companyOverview ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="dashboard-card">
                <div className="text-sm font-medium text-muted-foreground mb-1">Total Revenue</div>
                <div className="text-2xl font-bold text-green-600">KES {companyOverview.total_revenue?.toLocaleString?.() ?? '0'}</div>
              </div>
              <div className="dashboard-card">
                <div className="text-sm font-medium text-muted-foreground mb-1">Registration Fees</div>
                <div className="text-2xl font-bold text-blue-600">KES {companyOverview.registration_fees?.toLocaleString?.() ?? '0'}</div>
              </div>
              <div className="dashboard-card">
                <div className="text-sm font-medium text-muted-foreground mb-1">Insurance & Maintenance</div>
                <div className="text-2xl font-bold text-purple-600">KES {companyOverview.insurance_fees?.toLocaleString?.() ?? '0'}</div>
              </div>
              <div className="dashboard-card">
                <div className="text-sm font-medium text-muted-foreground mb-1">Interest / Company Share</div>
                <div className="text-2xl font-bold text-orange-600">KES {companyOverview.interest_bonuses?.toLocaleString?.() ?? '0'}</div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">Loading company overview…</div>
          )}
        </div>

        <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Getting Started as Admin</h3>
          <p className="text-slate-600 leading-relaxed max-w-3xl">
            Welcome to the new management portal. Use the sidebar to navigate between managing users, configuring system parameters, and viewing comprehensive activity logs. Your session is monitored for security and will auto-expire after 30 minutes of inactivity.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
