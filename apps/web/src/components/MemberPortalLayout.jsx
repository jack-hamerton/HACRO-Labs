import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Users, Wallet, PiggyBank, MessageSquare, MessageCircle, History, CreditCard, Bell, ShieldCheck, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';

const MemberPortalLayout = ({ title, subtitle, children }) => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const logoUrl = '/images/logo-mark.png';

  const navLinks = [
    { path: '/member-dashboard', label: 'Dashboard', icon: User },
    { path: '/group-dashboard', label: 'My Group', icon: Users },
    { path: '/messages', label: 'Messages', icon: MessageCircle },
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

  const memberName = [currentUser?.first_name, currentUser?.last_name].filter(Boolean).join(' ') || currentUser?.email || 'Member';
  const memberEmail = currentUser?.email || currentUser?.phone || 'member@hacro.local';
  const initialLetter = currentUser?.first_name?.charAt(0) || currentUser?.email?.charAt(0) || 'M';

  return (
    <div className="admin-theme h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.08),_transparent_32%),linear-gradient(180deg,_#f8fffb_0%,_#f4f8f5_100%)] flex flex-col md:flex-row text-foreground font-sans overflow-hidden">
      <div className="md:hidden flex items-center justify-between bg-slate-900 text-white p-4">
        <Link to="/" className="flex items-center">
              <img src={logoUrl} alt="HACRO Hub" className="h-10 object-contain" />
        </Link>
        <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="p-2">
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <aside className={`fixed inset-y-0 left-0 z-50 flex h-screen max-h-screen flex-col bg-slate-950/95 text-emerald-100 shadow-2xl shadow-emerald-950/40 transition-all duration-300 ease-in-out md:sticky md:top-0 md:translate-x-0 ${isMobileOpen ? 'w-20 translate-x-0' : '-translate-x-full w-20 md:w-20 md:translate-x-0'}`}>
        <div className="flex h-full flex-col overflow-hidden">
          <div className="flex h-20 items-center justify-center border-b border-emerald-800/70 px-4 shrink-0 md:px-3">
            <Link to="/" className="flex items-center justify-center">
              <img src={logoUrl} alt="HACRO Hub" className="h-10 object-contain md:h-8" />
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-5 md:px-2 md:py-4">
            <div className="mb-6 rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-600/20 via-emerald-700/10 to-transparent p-4 shadow-lg shadow-emerald-950/30 md:hidden">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-emerald-400 flex items-center justify-center text-emerald-950 font-semibold uppercase">
                  {initialLetter.toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white truncate">{memberName}</p>
                  <p className="text-xs text-emerald-100 truncate">{memberEmail}</p>
                </div>
              </div>
            </div>

            <nav className="space-y-2 pb-4">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileOpen(false)}
                    className={`group relative flex items-center justify-center gap-3 rounded-2xl p-3 text-sm font-medium transition-all md:justify-center ${active ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-emerald-100 hover:bg-emerald-500/10 hover:text-white'}`}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-white' : 'text-emerald-200'}`} />
                    <span className="pointer-events-none absolute left-full ml-3 hidden whitespace-nowrap rounded-lg bg-slate-950/95 px-3 py-2 text-[11px] font-semibold text-white shadow-lg group-hover:block">
                      {link.label}
                    </span>
                    <span className="sr-only">{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="border-t border-emerald-800/70 p-4 shrink-0 md:p-3">
            <button onClick={logout} className="flex w-full items-center justify-center gap-3 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-500 shadow-sm shadow-emerald-900/40 md:justify-center md:px-2 md:py-3">
              <LogOut className="w-5 h-5" />
              <span className="hidden">Log out</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 min-h-0 overflow-y-auto bg-transparent">
        <header className="hidden md:flex fixed top-0 md:left-20 left-0 right-0 h-16 bg-white/90 backdrop-blur border-b border-slate-200 items-center justify-between px-8 z-50">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center">
              <img src={logoUrl} alt="HACRO Hub" className="w-32 h-8 object-contain" />
            </Link>
            <div className="flex items-center gap-2 text-slate-700">
              <h1 className="text-lg font-semibold text-slate-800">{title || 'Member Portal'}</h1>
              {subtitle && <span className="text-sm text-muted-foreground">{subtitle}</span>}
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium text-slate-600">
            <span className="hidden sm:inline-block">{memberEmail}</span>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 sm:p-8 pt-16 md:pt-16">
          {(title || subtitle) && (
            <div className="mb-8 rounded-3xl border border-slate-200/70 bg-white/80 px-6 py-5 shadow-sm backdrop-blur">
              {title && <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{title}</h1>}
              {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
            </div>
          )}
          {children}
        </div>
      </main>

      {isMobileOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMobileOpen(false)} />}
    </div>
  );
};

export default MemberPortalLayout;
