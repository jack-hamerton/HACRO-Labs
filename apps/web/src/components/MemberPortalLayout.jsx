import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Users, Wallet, PiggyBank, MessageSquare, MessageCircle, History, CreditCard, Bell, ShieldCheck, Gavel, LogOut, Handshake } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';

const MemberPortalLayout = ({ title, subtitle, children }) => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const logoUrl = '/images/logo-mark.png';

  const navLinks = [
    { path: '/member-dashboard', label: 'Dashboard', icon: User },
    { path: '/hub', label: 'Youth Hub', icon: Handshake },
    { path: '/group-dashboard', label: 'My Group', icon: Users },
    { path: '/messages', label: 'Messages', icon: MessageCircle },
    { path: '/make-payment', label: 'Make Payment', icon: Wallet },
    { path: '/payment-history', label: 'Payment History', icon: CreditCard },
    { path: '/savings-contribution', label: 'Contributions', icon: PiggyBank },
    { path: '/loan-request', label: 'Request Loan', icon: ShieldCheck },
    { path: '/loan-repayment', label: 'Repay Loan', icon: History },
    { path: '/withdrawal', label: 'Withdrawal', icon: Wallet },
    { path: '/loan-voting', label: 'Loan Voting', icon: Gavel },
    { path: '/contribution-history', label: 'History', icon: History },
    { path: '/notifications', label: 'Notifications', icon: Bell }
  ];
  const headerLinks = navLinks.slice(0, 6);
  const footerLinks = navLinks.slice(6);

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
    <div className="admin-theme min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.08),_transparent_32%),linear-gradient(180deg,_#f8fffb_0%,_#f4f8f5_100%)] flex flex-col text-foreground font-sans overflow-hidden">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-900/50 bg-slate-950/95 backdrop-blur-xl shadow-sm shadow-slate-950/20">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3">
              <img src={logoUrl} alt="HACRO Hub" className="h-10 w-10 object-contain" />
              <div className="hidden sm:block">
                <p className="text-xs uppercase tracking-[0.28em] text-emerald-400/80">Member Portal</p>
                <h1 className="text-base font-semibold text-white">{title || 'Member Portal'}</h1>
                {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-2 overflow-x-auto py-1">
            {headerLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex h-11 min-w-[4.5rem] items-center justify-center gap-2 rounded-2xl px-3 text-xs font-semibold transition ${active ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900/70 text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
          <div className="flex md:hidden items-center gap-2 overflow-x-auto py-1">
            {headerLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl text-slate-200 transition ${active ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900/80 hover:bg-slate-800 hover:text-white'}`}
                  title={link.label}
                >
                  <Icon className="w-5 h-5" />
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-semibold text-white truncate max-w-[14rem]">{memberName}</span>
              <span className="text-xs text-slate-400 truncate max-w-[14rem]">{memberEmail}</span>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-900/20">
              {initialLetter.toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 min-h-0 overflow-y-auto pt-24 pb-28 bg-transparent">
        <div className="flex-1 overflow-auto p-4 sm:p-8">
          {(title || subtitle) && (
            <div className="mb-8 rounded-3xl border border-slate-200/70 bg-white/80 px-6 py-5 shadow-sm backdrop-blur">
              {title && <h1 className="text-3xl md:text-4xl font-bold text-slate-950 mb-2">{title}</h1>}
              {subtitle && <p className="text-slate-600">{subtitle}</p>}
            </div>
          )}
          {children}
        </div>
      </main>

      <footer className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-900/50 bg-slate-950/95 backdrop-blur-xl shadow-inner shadow-slate-950/20">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-3 py-3 sm:px-6">
          <div className="hidden sm:flex flex-1 items-center gap-2 overflow-x-auto py-1">
            {footerLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`group flex min-w-[4.5rem] flex-col items-center justify-center gap-1 rounded-3xl px-3 py-2 text-xs font-semibold transition ${active ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900/75 text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="hidden sm:block text-[10px]">{link.label}</span>
                </Link>
              );
            })}
            <button
              type="button"
              onClick={logout}
              className="group flex min-w-[4.5rem] flex-col items-center justify-center gap-1 rounded-3xl bg-red-500 px-3 py-2 text-xs font-semibold text-slate-950 transition hover:bg-red-400"
            >
              <LogOut className="h-5 w-5" />
              <span className="hidden sm:block text-[10px]">Logout</span>
            </button>
          </div>
          <div className="flex sm:hidden items-center gap-3 overflow-x-auto py-2 px-1">
            {footerLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex h-14 min-w-[3.5rem] items-center justify-center rounded-3xl text-slate-200 transition ${active ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900/80 hover:bg-slate-800 hover:text-white'}`}
                  title={link.label}
                >
                  <Icon className="w-6 h-6" />
                </Link>
              );
            })}
            <button
              type="button"
              onClick={logout}
              className="flex h-14 w-14 items-center justify-center rounded-3xl bg-red-500 text-slate-950 transition hover:bg-red-400"
              title="Logout"
            >
              <LogOut className="w-6 h-6" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MemberPortalLayout;
