import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Users, Wallet, PiggyBank, MessageSquare, History, CreditCard, Bell, ShieldCheck, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';

const MemberPortalLayout = ({ title, subtitle, children }) => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const logoUrl = '/images/logo-mark.png';

  const navLinks = [
    { path: '/member-dashboard', label: 'Dashboard', icon: User },
    { path: '/group-dashboard', label: 'My Group', icon: Users },
    { path: '/make-payment', label: 'Make Payment', icon: Wallet },
    { path: '/payment-history', label: 'Payment History', icon: CreditCard },
    { path: '/savings-contribution', label: 'Contributions', icon: PiggyBank },
    { path: '/loan-request', label: 'Request Loan', icon: ShieldCheck },
    { path: '/loan-repayment', label: 'Repay Loan', icon: History },
    { path: '/withdrawal', label: 'Withdrawal', icon: Wallet },
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
        <Link to="/" className="flex items-center">
          <div className="h-11 w-32 rounded-2xl border border-[hsl(var(--primary)_/_0.12)] bg-white/95 px-2 shadow-sm ring-1 ring-black/5 overflow-hidden flex items-center justify-center">
            <img src={logoUrl} alt="HACRO Labs" className="h-full w-full object-contain" />
          </div>
        </Link>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="inline-flex items-center justify-center rounded-xl bg-[hsl(var(--primary)_/_0.12)] px-3 py-2 text-[hsl(var(--primary))] font-semibold"
        >
          {isMobileOpen ? 'Close' : 'Menu'}
        </button>
      </div>

      <aside className={`fixed inset-y-0 left-0 z-50 w-80 h-screen max-h-screen overflow-hidden transform bg-[hsl(var(--primary)_/_0.08)] border-r border-[hsl(var(--primary)_/_0.16)] transition-transform duration-300 md:static md:translate-x-0 md:h-auto md:max-h-none md:overflow-visible ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-full flex-col overflow-hidden p-6">
          <div className="mb-8 shrink-0">
            <Link to="/" className="flex items-center">
              <div className="h-12 w-40 rounded-2xl border border-[hsl(var(--primary)_/_0.12)] bg-white/95 px-2 shadow-sm ring-1 ring-black/5 overflow-hidden flex items-center justify-center">
                <img src={logoUrl} alt="HACRO Labs" className="h-full w-full object-contain" />
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-4 mb-8 shrink-0">
            <div className="w-14 h-14 rounded-3xl bg-[hsl(var(--primary)_/_0.16)] flex items-center justify-center text-[hsl(var(--primary))] font-bold uppercase">
              {currentUser?.first_name?.charAt(0) || currentUser?.email?.charAt(0) || 'M'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{currentUser?.first_name} {currentUser?.last_name}</p>
              <p className="text-xs text-muted-foreground truncate">{currentUser?.email}</p>
            </div>
          </div>

          <nav className="flex-1 space-y-2 overflow-y-auto pb-4">
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

          <div className="mt-4 pt-4 border-t border-[hsl(var(--primary)_/_0.12)] shrink-0">
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
        </div>
      </aside>

      {isMobileOpen && <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setIsMobileOpen(false)} />}

      <main className="flex-1 min-h-screen overflow-auto bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.08),_transparent_32%),linear-gradient(180deg,_#f8fafc_0%,_#f5f7fb_100%)]">
        <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8 xl:px-10">
          {(title || subtitle) && (
            <div className="mb-8 rounded-3xl border border-border/70 bg-white/80 px-6 py-5 shadow-sm backdrop-blur">
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
