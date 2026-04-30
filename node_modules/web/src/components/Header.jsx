import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Wallet, Bell, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { isAuthenticated, isMember, isAdmin, logout, currentUser } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    if (isMember && currentUser) {
      fetchNotifications();
      
      // Subscribe to real-time notifications
      pb.collection('notifications').subscribe('*', function (e) {
        if (e.action === 'create' && e.record.member_id === currentUser.id) {
          setNotifications(prev => [e.record, ...prev].slice(0, 5));
          setUnreadCount(prev => prev + 1);
        }
      });

      return () => {
        pb.collection('notifications').unsubscribe('*');
      };
    }
  }, [isMember, currentUser]);

  const fetchNotifications = async () => {
    try {
      const records = await pb.collection('notifications').getList(1, 5, {
        filter: `member_id="${currentUser.id}"`,
        sort: '-created',
        $autoCancel: false
      });
      setNotifications(records.items);
      
      const unread = await pb.collection('notifications').getList(1, 1, {
        filter: `member_id="${currentUser.id}" && read_status=false`,
        $autoCancel: false
      });
      setUnreadCount(unread.totalItems);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await pb.collection('notifications').update(id, { read_status: true }, { $autoCancel: false });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read_status: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
              <Wallet className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">HACRO Labs</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className={`text-sm font-medium transition-colors duration-200 ${isActive('/') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>Home</Link>
            <Link to="/staff" className={`text-sm font-medium transition-colors duration-200 ${isActive('/staff') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>Staff</Link>            <Link to="/staff" className={`text-sm font-medium transition-colors duration-200 ${isActive('/staff') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>Staff</Link>
            {!isAuthenticated && (
              <>
                <Link to="/register" className={`text-sm font-medium transition-colors duration-200 ${isActive('/register') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>Register</Link>
                <Link to="/member-login" className={`text-sm font-medium transition-colors duration-200 ${isActive('/member-login') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>Member Login</Link>
                <Link to="/admin-login" className={`text-sm font-medium transition-colors duration-200 ${isActive('/admin-login') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>Admin Login</Link>
              </>
            )}

            {isMember && (
              <>
                <Link to="/member-dashboard" className={`text-sm font-medium transition-colors duration-200 ${isActive('/member-dashboard') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>Dashboard</Link>
                <Link to="/make-payment" className={`text-sm font-medium transition-colors duration-200 ${isActive('/make-payment') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>Make Payment</Link>
                <Link to="/group-dashboard" className={`text-sm font-medium transition-colors duration-200 ${isActive('/group-dashboard') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>My Group</Link>
                
                <div className="relative">
                  <button 
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center rounded-full">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50">
                      <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
                        <h3 className="font-semibold text-foreground">Notifications</h3>
                        <Link to="/notifications" onClick={() => setNotificationsOpen(false)} className="text-xs text-primary hover:underline">View All</Link>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map(notif => (
                            <div key={notif.id} className={`p-4 border-b border-border/50 hover:bg-muted/50 transition-colors ${!notif.read_status ? 'bg-primary/5' : ''}`}>
                              <div className="flex justify-between items-start mb-1">
                                <p className="text-sm font-medium text-foreground">{notif.title}</p>
                                {!notif.read_status && (
                                  <button onClick={() => markAsRead(notif.id)} className="text-[10px] text-primary hover:underline">Mark read</button>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2">{notif.message}</p>
                              <p className="text-[10px] text-muted-foreground mt-2">{new Date(notif.created).toLocaleDateString()}</p>
                            </div>
                          ))
                        ) : (
                          <div className="p-8 text-center text-muted-foreground text-sm">No recent notifications</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-3 pl-4 border-l border-border">
                  {currentUser?.profile_picture ? (
                    <img src={pb.files.getUrl(currentUser, currentUser.profile_picture)} alt="Profile" className="w-8 h-8 rounded-xl object-cover border border-border" />
                  ) : (
                    <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center border border-border">
                      <UserIcon className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                  <button onClick={handleLogout} className="text-sm font-medium text-muted-foreground hover:text-destructive transition-colors duration-200">Logout</button>
                </div>
              </>
            )}

            {isAdmin && (
              <>
                <Link to="/admin-dashboard" className={`text-sm font-medium transition-colors duration-200 ${isActive('/admin-dashboard') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>Dashboard</Link>
                <Link to="/analytics" className={`text-sm font-medium transition-colors duration-200 ${isActive('/analytics') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>Analytics</Link>
                <Link to="/admin/loan-management" className={`text-sm font-medium transition-colors duration-200 ${isActive('/admin/loan-management') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>Loans</Link>
                <button onClick={handleLogout} className="text-sm font-medium text-muted-foreground hover:text-destructive transition-colors duration-200 ml-4">Logout</button>
              </>
            )}
          </nav>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors duration-200">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-4">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className={`text-sm font-medium ${isActive('/') ? 'text-primary' : 'text-foreground'}`}>Home</Link>
              <Link to="/staff" onClick={() => setMobileMenuOpen(false)} className={`text-sm font-medium ${isActive('/staff') ? 'text-primary' : 'text-foreground'}`}>Staff</Link>
              {!isAuthenticated && (
                <>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-foreground">Register</Link>
                  <Link to="/member-login" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-foreground">Member Login</Link>
                  <Link to="/admin-login" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-foreground">Admin Login</Link>
                </>
              )}
              {isMember && (
                <>
                  <Link to="/member-dashboard" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-foreground">Dashboard</Link>
                  <Link to="/notifications" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-foreground">Notifications ({unreadCount})</Link>
                  <button onClick={handleLogout} className="text-sm font-medium text-destructive text-left">Logout</button>
                </>
              )}
              {isAdmin && (
                <>
                  <Link to="/admin-dashboard" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-foreground">Admin Dashboard</Link>
                  <Link to="/analytics" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-foreground">Analytics</Link>
                  <button onClick={handleLogout} className="text-sm font-medium text-destructive text-left">Logout</button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
