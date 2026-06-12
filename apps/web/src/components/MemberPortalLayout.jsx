import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Users, Wallet, PiggyBank, MessageSquare, History, CreditCard, Bell, ShieldCheck, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';

const MemberPortalLayout = ({ title, subtitle, children }) => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navLinks = [
    { path: '/member-dashboard', label: 'Dashboard', icon: User },
    { path: '/group-dashboard', label: 'My Group', icon: Users },
    { path: '/make-payment', label: 'Make Payment', icon: Wallet },
    { path: '/payment-history', label: 'Payment History', icon: CreditCard },
    { path: '/savings-contribution', label: 'Contributions', icon: PiggyBank },
    { path: '/loan-request', label: 'Request Loan', icon: ShieldCheck },
    { path: '/loan-repayment', label: 'Repay Loan', icon: History },
    { path: '/loan-voting', label: 'Loan Voting', icon: Bell },
    { path: '/contribution-history', label: 'History', icon: History },
    { path: '/notifications', label: 'Notifications', icon: MessageSquare }
  ];

  const isActive = (path) => {
    if (location.pathname === path) {
      return true;
    }
    if (path === '/group-dashboard' && location.pathname.startsWith('/group')) {
      return true;
    }
    if (path === '/loan-repayment' && location.pathname.startsWith('/loan/')) {
      return true;
    }
    return false;
  };

  return (
    <div className="admin-theme min-h-screen bg-background flex flex-col md:flex-row text-foreground font-sans">
      <div className="md:hidden bg-white border-b border-border p-4 flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold text-foreground">Member Portal</p>
          <p className="text-xs text-muted-foreground">Green member portal navigation</p>
        </div>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="inline-flex items-center justify-center rounded-xl bg-[hsl(var(--primary)_/_0.12)] px-3 py-2 text-[hsl(var(--primary))] font-semibold"
        >
          {isMobileOpen ? 'Close' : 'Menu'}
        </button>
      </div>

      <aside className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-[hsl(var(--primary)_/_0.08)] border-r border-[hsl(var(--primary)_/_0.16)] p-6 transition-transform duration-300 md:static md:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-8">
          <div className="text-2xl font-bold text-[hsl(var(--primary))] mb-1">HACRO Member</div>
          <p className="text-sm text-muted-foreground">Member sidebar navigation</p>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-3xl bg-[hsl(var(--primary)_/_0.16)] flex items-center justify-center text-[hsl(var(--primary))] font-bold uppercase">
            {currentUser?.first_name?.charAt(0) || currentUser?.email?.charAt(0) || 'M'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{currentUser?.first_name} {currentUser?.last_name}</p>
            <p className="text-xs text-muted-foreground truncate">{currentUser?.email}</p>
          </div>
        </div>

        <nav className="space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-colors ${active ? 'bg-[hsl(var(--primary))] text-white' : 'text-foreground hover:bg-[hsl(var(--primary)_/_0.12)]'}`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-[hsl(var(--primary))]'}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 pt-4 border-t border-[hsl(var(--primary)_/_0.12)]">
          <button
            type="button"
            onClick={() => {
              logout();
              setIsMobileOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold text-[hsl(var(--primary))] bg-white border border-[hsl(var(--primary)_/_0.16)] hover:bg-[hsl(var(--primary)_/_0.08)] transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </aside>

      {isMobileOpen && <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setIsMobileOpen(false)} />}

      <main className="flex-1 min-h-screen overflow-auto bg-slate-50">
        <div className="p-4 sm:p-8 md:ml-72">
          {(title || subtitle) && (
            <div className="mb-8">
              {title && <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{title}</h1>}
              {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  );
};

export default MemberPortalLayout;
