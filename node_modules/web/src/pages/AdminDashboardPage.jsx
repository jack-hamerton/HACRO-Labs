import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Users, LayoutGrid, PiggyBank, Wallet, Clock, Loader2, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import AdminLayout from '@/components/AdminLayout.jsx';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';

const AdminDashboardPage = () => {
  const { currentAdmin, isSuperAdmin } = useAdminAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [companyOverview, setCompanyOverview] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStats({ members: 0, groups: 0, savings: 0, loans: 0, pendingApprovals: 0 });

        try {
          const mems = await pb.collection('members').getList(1, 1, { $autoCancel: false });
          const grps = await pb.collection('groups').getList(1, 1, { $autoCancel: false });
          const savs = await pb.collection('savings').getFullList({ $autoCancel: false });
          const loans = await pb.collection('loans').getFullList({ filter: 'status="active" || status="partially_paid" || status="approved"', $autoCancel: false });
          const approvals = await pb.collection('loan_approvals').getList(1, 1, { filter: 'approved=false', $autoCancel: false });

          setStats({
            members: mems.totalItems,
            groups: grps.totalItems,
            savings: savs.reduce((total, item) => total + Number(item.amount || item.total_savings || 0), 0),
            loans: loans.reduce((total, item) => total + Number(item.amount || 0), 0),
            pendingApprovals: approvals.totalItems,
          });
        } catch (dataErr) {
          console.warn('Could not fetch detailed stats:', dataErr.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    const fetchCompanyOverview = async () => {
      try {
        const token = localStorage.getItem('adminToken') || localStorage.getItem('admin_token');
        const res = await fetch('/api/admin/company-accounts', {
          headers: { 'Content-Type': 'application/json', 'Authorization': token ? `Bearer ${token}` : '' },
        });
        if (!res.ok) throw new Error('Failed to load company overview');
        const json = await res.json();
        setCompanyOverview(json.company_overview || json);
      } catch (err) {
        console.warn('Company overview fetch failed', err.message || err);
      }
    };

    fetchCompanyOverview();

    const onCompanyEvent = async () => {
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

    if (!subscribed) {
      pollingId = setInterval(fetchCompanyOverview, 15000);
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
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    { title: 'Total Members', value: stats.members, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Active Groups', value: stats.groups, icon: LayoutGrid, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { title: 'Total Savings', value: `KES ${stats.savings.toLocaleString()}`, icon: PiggyBank, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Active Loans Vol.', value: `KES ${stats.loans.toLocaleString()}`, icon: Wallet, color: 'text-orange-600', bg: 'bg-orange-50' },
    { title: 'Pending Votes', value: stats.pendingApprovals, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <AdminLayout>
      <Helmet><title>Admin Dashboard - Hacro Labs</title></Helmet>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="rounded-[28px] border border-emerald-200 bg-gradient-to-br from-emerald-600 via-emerald-500 to-green-700 p-8 text-white shadow-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-medium backdrop-blur">
                <ShieldCheck className="h-4 w-4" />
                {isSuperAdmin ? 'Super Admin Portal' : 'Admin Portal'}
              </div>
              <h2 className="mt-4 text-3xl font-bold tracking-tight">Welcome back, {currentAdmin?.full_name || 'Admin'}</h2>
              <p className="mt-2 max-w-2xl text-emerald-50/90">Monitor the platform, manage growth, and keep operations moving smoothly from one elegant view.</p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-4 backdrop-blur">
              <p className="text-sm text-emerald-100">Managed by</p>
              <p className="mt-1 text-xl font-semibold">Jack Hamerton</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((card, index) => (
            <div key={index} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.bg}`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
              <p className="mt-4 text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">{card.title}</p>
              <p className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">{card.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Company Collections</h3>
                <p className="mt-1 text-sm text-slate-500">Realtime view of the financial activity in the system.</p>
              </div>
              <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-600">Live</div>
            </div>
            {companyOverview ? (
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-sm font-medium text-slate-500">Total Revenue</div>
                  <div className="mt-2 text-2xl font-bold text-emerald-600">KES {companyOverview.total_revenue?.toLocaleString?.() ?? '0'}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-sm font-medium text-slate-500">Registration Fees</div>
                  <div className="mt-2 text-2xl font-bold text-blue-600">KES {companyOverview.registration_fees?.toLocaleString?.() ?? '0'}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-sm font-medium text-slate-500">Insurance & Maintenance</div>
                  <div className="mt-2 text-2xl font-bold text-purple-600">KES {companyOverview.insurance_fees?.toLocaleString?.() ?? '0'}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-sm font-medium text-slate-500">Interest / Company Share</div>
                  <div className="mt-2 text-2xl font-bold text-orange-600">KES {companyOverview.interest_bonuses?.toLocaleString?.() ?? '0'}</div>
                </div>
              </div>
            ) : (
              <div className="mt-6 text-sm text-slate-500">Loading company overview…</div>
            )}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-emerald-600">
              <Sparkles className="h-5 w-5" />
              <h3 className="text-lg font-semibold text-slate-900">Quick access</h3>
            </div>
            <div className="mt-4 space-y-3">
              {isSuperAdmin && (
                <Link to="/admin-manage-admins" className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50">
                  <span>Manage admins and permissions</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
              <Link to="/admin-member-details" className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50">
                <span>Review members</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/admin-withdrawal-management" className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50">
                <span>Monitor withdrawals</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
