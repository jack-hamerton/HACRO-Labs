import React, { useEffect, useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';
import { LayoutDashboard, Users, User, Activity, LogOut, Menu, X, ShieldAlert, ChartBar, Building, CreditCard, FileText, Sparkles, ShieldCheck, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const AdminLayout = ({ children }) => {
  const { currentAdmin, logout, hasPermission, isSuperAdmin } = useAdminAuth();
  const location = useLocation();
  const logoUrl = '/images/logo-mark.png';
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [warningShown, setWarningShown] = useState(false);

  const resetTimer = useCallback(() => {
    if (window.adminTimeoutId) clearTimeout(window.adminTimeoutId);
    if (window.adminWarningId) clearTimeout(window.adminWarningId);

    setWarningShown(false);

    window.adminWarningId = setTimeout(() => {
      setWarningShown(true);
      toast.warning('Your session will expire in 5 minutes due to inactivity.', {
        duration: 10000,
        action: { label: 'Stay Logged In', onClick: resetTimer },
      });
    }, 25 * 60 * 1000);

    window.adminTimeoutId = setTimeout(() => {
      toast.error('Session expired due to inactivity.');
      logout();
    }, 30 * 60 * 1000);
  }, [logout]);

  useEffect(() => {
    resetTimer();
    const events = ['mousemove', 'keydown', 'scroll', 'click'];
    const handleEvent = () => {
      if (!warningShown) resetTimer();
    };

    events.forEach((event) => window.addEventListener(event, handleEvent));
    return () => {
      events.forEach((event) => window.removeEventListener(event, handleEvent));
      if (window.adminTimeoutId) clearTimeout(window.adminTimeoutId);
      if (window.adminWarningId) clearTimeout(window.adminWarningId);
    };
  }, [resetTimer, warningShown]);

  const navLinks = [
    { path: '/admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ...(isSuperAdmin || hasPermission('view_analytics') ? [{ path: '/analytics', label: 'Analytics', icon: ChartBar }] : []),
    ...(isSuperAdmin || hasPermission('manage_company_accounts') ? [{ path: '/admin-company-accounts', label: 'Company Accounts', icon: Building }] : []),
    ...(isSuperAdmin || hasPermission('manage_members') ? [{ path: '/admin-member-details', label: 'Member Details', icon: User }] : []),
    ...(isSuperAdmin || hasPermission('manage_loans') ? [{ path: '/admin-loan-management', label: 'Loan Management', icon: CreditCard }] : []),
    ...(isSuperAdmin || hasPermission('manage_payments') ? [{ path: '/admin-payment-management', label: 'Payment Management', icon: CreditCard }] : []),
    ...(isSuperAdmin || hasPermission('manage_withdrawals') ? [{ path: '/admin-withdrawal-management', label: 'Withdrawals', icon: CreditCard }] : []),
    ...(isSuperAdmin || hasPermission('manage_members') ? [{ path: '/admin-member-search', label: 'Member Search', icon: Users }] : []),
    ...(isSuperAdmin || hasPermission('manage_members') ? [{ path: '/admin-fraud-management', label: 'Fraud Review', icon: AlertTriangle }] : []),
    ...(isSuperAdmin || hasPermission('manage_newsletters') ? [{ path: '/admin-newsletter', label: 'Newsletters', icon: FileText }] : []),
    ...(isSuperAdmin || hasPermission('manage_tasks') ? [{ path: '/admin-task-management', label: 'Task Management', icon: Activity }] : []),
    ...(isSuperAdmin || hasPermission('manage_messaging') ? [{ path: '/admin-messaging', label: 'Messaging', icon: Users }] : []),
    ...(isSuperAdmin || hasPermission('manage_messaging') ? [{ path: '/admin-group-chat', label: 'Admin Chat', icon: Users }] : []),
    ...(isSuperAdmin || hasPermission('manage_admins') ? [{ path: '/admin-manage-admins', label: 'Manage Admins', icon: ShieldAlert }] : []),
    ...(isSuperAdmin || hasPermission('manage_profile') ? [{ path: '/admin-profile', label: 'Profile', icon: User }] : []),
    ...(isSuperAdmin || hasPermission('view_activity_log') ? [{ path: '/admin-activity-log', label: 'Activity Log', icon: Activity }] : []),
  ];

  const isActive = (path) => location.pathname === path;
  const currentTitle = navLinks.find((link) => isActive(link.path))?.label || 'Administration';
  const displayName = currentAdmin?.full_name || currentAdmin?.email || 'Admin';

  return (
    <div className="admin-theme min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.10),_transparent_32%),linear-gradient(135deg,_#f8fffb_0%,_#f4f8f5_100%)] flex flex-col md:flex-row text-foreground font-sans">
      <div className="md:hidden flex items-center justify-between bg-slate-900 text-white p-4">
          <Link to="/" className="flex items-center">
            <img src={logoUrl} alt="HACRO Hub" className="h-10 object-contain" />
          </Link>
        <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="p-2">
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <aside className={`${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:sticky md:top-0 md:h-screen inset-y-0 left-0 z-50 w-72 bg-emerald-950 text-emerald-100 flex flex-col h-screen max-h-screen overflow-hidden transition-transform duration-300 ease-in-out`}>
        <div className="h-20 flex items-center px-6 border-b border-emerald-800 shrink-0">
            <Link to="/" className="flex items-center">
            <img src={logoUrl} alt="HACRO Hub" className="h-12 object-contain" />
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 md:pb-4">
          <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-600/20 via-emerald-700/10 to-transparent p-4 mb-6 shadow-lg shadow-emerald-950/30">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-emerald-400 flex items-center justify-center text-emerald-950 font-semibold uppercase">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{displayName}</p>
                <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-emerald-200">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {isSuperAdmin ? 'Super Admin' : 'Admin'}
                </div>
              </div>
            </div>
          </div>

          <nav className="space-y-1 pb-4">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${active ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-emerald-100 hover:bg-emerald-500/10 hover:text-white'}`}
                >
                  <link.icon className={`w-5 h-5 ${active ? 'text-white' : 'text-emerald-200'}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-6 border-t border-emerald-800 shrink-0">
          <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-sm shadow-emerald-900/40">
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-h-screen overflow-hidden bg-transparent">
        <header className="hidden md:flex fixed top-0 md:left-72 left-0 right-0 h-16 bg-white/90 backdrop-blur border-b border-slate-200 items-center justify-between px-8 z-50">
          <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center">
              <img src={logoUrl} alt="HACRO Hub" className="w-32 h-8 object-contain" />
            </Link>
            <div className="flex items-center gap-2 text-slate-700">
              <Sparkles className="h-4 w-4 text-emerald-500" />
              <h1 className="text-lg font-semibold text-slate-800">{currentTitle}</h1>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium text-slate-600">
            <span className="hidden sm:inline-block">{currentAdmin?.email}</span>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-4 sm:p-8 pt-16 md:pt-16">
          {children}
        </div>
      </main>

      {isMobileOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMobileOpen(false)} />}
    </div>
  );
};

export default AdminLayout;
