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

      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-emerald-950 text-emerald-100 flex flex-col h-screen max-h-screen transition-transform duration-300 ease-in-out md:sticky md:top-0 md:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-full flex-col overflow-hidden">
          <div className="h-20 flex items-center px-6 border-b border-emerald-800 shrink-0">
                <Link to="/" className="flex items-center">
              <img src={logoUrl} alt="HACRO Hub" className="h-12 object-contain" />
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-5 md:pb-4">
            <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-600/20 via-emerald-700/10 to-transparent p-4 mb-6 shadow-lg shadow-emerald-950/30">
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

            <nav className="space-y-1 pb-4">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${active ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-emerald-100 hover:bg-emerald-500/10 hover:text-white'}`}
                  >
                    <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-emerald-200'}`} />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="p-6 border-t border-emerald-800 shrink-0">
            <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-sm shadow-emerald-900/40">
              <LogOut className="w-5 h-5" />
              Log out
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 min-h-0 overflow-y-auto bg-transparent">
        <header className="hidden md:flex fixed top-0 md:left-72 left-0 right-0 h-16 bg-white/90 backdrop-blur border-b border-slate-200 items-center justify-between px-8 z-50">
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
