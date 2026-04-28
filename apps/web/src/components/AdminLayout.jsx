import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';
import { LayoutDashboard, Users, User, Activity, LogOut, Menu, X, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

const AdminLayout = ({ children }) => {
  const { currentAdmin, logout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [warningShown, setWarningShown] = useState(false);

  // 30 min inactivity timer
  const resetTimer = useCallback(() => {
    if (window.adminTimeoutId) clearTimeout(window.adminTimeoutId);
    if (window.adminWarningId) clearTimeout(window.adminWarningId);
    
    setWarningShown(false);
    
    window.adminWarningId = setTimeout(() => {
      setWarningShown(true);
      toast.warning('Your session will expire in 5 minutes due to inactivity.', {
         duration: 10000,
         action: { label: 'Stay Logged In', onClick: resetTimer }
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
    
    events.forEach(e => window.addEventListener(e, handleEvent));
    return () => {
      events.forEach(e => window.removeEventListener(e, handleEvent));
      if (window.adminTimeoutId) clearTimeout(window.adminTimeoutId);
      if (window.adminWarningId) clearTimeout(window.adminWarningId);
    };
  }, [resetTimer, warningShown]);

  const navLinks = [
    { path: '/admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ...(currentAdmin?.role === 'super_admin' ? [{ path: '/admin-manage-admins', label: 'Manage Admins', icon: ShieldAlert }] : []),
    { path: '/admin-profile', label: 'Profile', icon: User },
    { path: '/admin-activity-log', label: 'Activity Log', icon: Activity },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="admin-theme min-h-screen bg-background flex flex-col md:flex-row text-foreground font-sans">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between bg-slate-900 text-white p-4">
        <span className="text-xl font-bold tracking-tight">HACRO Admin</span>
        <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="p-2">
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 fixed md:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out
      `}>
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <span className="text-xl font-bold text-white tracking-tight">HACRO Labs Admin</span>
        </div>
        
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold uppercase">
              {currentAdmin?.full_name?.charAt(0) || 'A'}
            </div>
            <div>
              <p className="text-sm font-medium text-white line-clamp-1">{currentAdmin?.full_name}</p>
              <p className="text-xs text-slate-500 capitalize">{currentAdmin?.role.replace('_', ' ')}</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    active ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <link.icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-400'}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-800">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden bg-slate-50">
        <header className="hidden md:flex h-16 bg-white border-b border-slate-200 items-center justify-between px-8 z-10">
          <h1 className="text-lg font-semibold text-slate-800">
            {navLinks.find(l => isActive(l.path))?.label || 'Administration'}
          </h1>
          <div className="flex items-center gap-4 text-sm font-medium text-slate-600">
            <span className="hidden sm:inline-block">{currentAdmin?.email}</span>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-4 sm:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;