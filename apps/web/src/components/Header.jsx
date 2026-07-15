import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Wallet, Bell, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [linkMode, setLinkMode] = useState('light');
  const headerRef = useRef(null);
  const { isAuthenticated, isMember, isAdmin, logout, currentUser } = useAuth();
  const location = useLocation();

  const logoUrl = '/images/logo-mark.png';

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    if (isMember && currentUser) {
      fetchNotifications();
      pb.collection('notifications').subscribe('*', function (e) {
        if (e.action === 'create' && e.record.member_id === currentUser.id) {
          setNotifications(prev => [e.record, ...prev].slice(0, 5));
          setUnreadCount(prev => prev + 1);
        }
      });
      return () => { pb.collection('notifications').unsubscribe('*'); };
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

  const handleLogout = () => { logout(); setMobileMenuOpen(false); };

  useEffect(() => {
    const updateLinkMode = () => {
      const bgColor = window.getComputedStyle(headerRef.current).backgroundColor;
      if (!bgColor) {
        setLinkMode('light');
        return;
      }
      const rgb = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (!rgb) {
        setLinkMode('light');
        return;
      }
      const r = Number(rgb[1]);
      const g = Number(rgb[2]);
      const b = Number(rgb[3]);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      setLinkMode(brightness < 140 ? 'dark' : 'light');
    };

    updateLinkMode();
    const observer = new MutationObserver(updateLinkMode);
    if (headerRef.current) {
      observer.observe(headerRef.current, { attributes: true, attributeFilter: ['class', 'style'] });
    }
    window.addEventListener('resize', updateLinkMode);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateLinkMode);
    };
  }, []);

  const linkColorClasses = (active) => {
    const base = active ? 'text-green-500' : linkMode === 'dark' ? 'text-white' : 'text-slate-900';
    const hover = active || linkMode === 'dark' ? 'hover:text-green-500' : 'hover:text-green-500';
    return `text-sm font-medium transition-colors duration-200 ${base} ${!active ? hover : ''}`;
  };

  const mobileLinkColorClasses = (active) => {
    const base = active ? 'text-green-500' : linkMode === 'dark' ? 'text-white' : 'text-slate-900';
    return `text-base font-medium transition-colors duration-200 ${base} hover:text-green-500`;
  };

  return (
    <header ref={headerRef} className="bg-white/94 border-b border-slate-200 fixed top-0 left-0 right-0 z-50 shadow-sm backdrop-blur-sm print:hidden">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-16">

          {                       }
          <Link to="/" className="flex items-center gap-3">
            {logoUrl ? (
              <img src={logoUrl} alt="HACRO Hub" className="h-9 sm:h-10 object-contain" />
            ) : (
              <Wallet className="w-8 h-8 text-primary-foreground" />
            )}
          </Link>

          {                                                                                                   }
          <div className="flex items-center justify-between w-full">
            <div />
            <div className="flex items-center gap-3">
              <nav className="hidden md:flex items-center gap-4">
                <Link to="/" className={linkColorClasses(isActive('/'))}>Home</Link>
                <Link to="/register" className={linkColorClasses(isActive('/register'))}>Register</Link>
                <Link to="/member-login" className={linkColorClasses(isActive('/member-login'))}>Login</Link>
                <Link to="/donate" className={linkColorClasses(isActive('/donate'))}>Donate</Link>
                <Link to="/newsletter" className={linkColorClasses(isActive('/newsletter'))}>Newsletter</Link>
                <Link to="/staff" className={linkColorClasses(isActive('/staff'))}>Our Team</Link>
              </nav>

              {isMember && (
                <div className="relative">
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="relative p-2 text-muted-foreground hover:text-green-500 transition-colors"
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
                        <Link to="/notifications" onClick={() => setNotificationsOpen(false)} className="text-xs text-green-500 hover:underline">View All</Link>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map(notif => (
                            <div key={notif.id} className={`p-4 border-b border-border/50 hover:bg-muted/50 transition-colors ${!notif.read_status ? 'bg-primary/5' : ''}`}>
                              <div className="flex justify-between items-start mb-1">
                                <p className="text-sm font-medium text-foreground">{notif.title}</p>
                                {!notif.read_status && (
                                  <button onClick={() => markAsRead(notif.id)} className="text-[10px] text-green-500 hover:underline">Mark read</button>
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
              )}

              {isAuthenticated && (
                <div className="hidden md:flex items-center space-x-3 pl-4 border-l border-slate-200">
                  {currentUser?.profile_picture ? (
                    <img src={pb.files.getUrl(currentUser, currentUser.profile_picture)} alt="Profile" className="w-8 h-8 rounded-xl object-cover border border-slate-200" />
                  ) : (
                    <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200">
                      <UserIcon className="w-4 h-4 text-slate-600" />
                    </div>
                  )}
                  <button onClick={handleLogout} className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors duration-200">Logout</button>
                </div>
              )}

              {                  }
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors duration-200 text-primary"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {             }
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-4">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className={mobileLinkColorClasses(isActive('/'))}>Home</Link>
              <Link to="/staff" onClick={() => setMobileMenuOpen(false)} className={mobileLinkColorClasses(isActive('/staff'))}>Our Team</Link>
              <Link to="/newsletter" onClick={() => setMobileMenuOpen(false)} className={mobileLinkColorClasses(isActive('/newsletter'))}>Newsletter</Link>
              <Link to="/donate" onClick={() => setMobileMenuOpen(false)} className={mobileLinkColorClasses(isActive('/donate'))}>Donate</Link>
              {!isAuthenticated && (
                <>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} className={`${mobileLinkColorClasses(false)} ${linkMode === 'dark' ? '' : ''}`}>Register</Link>
                  <Link to="/member-login" onClick={() => setMobileMenuOpen(false)} className={mobileLinkColorClasses(isActive('/member-login'))}>Member Login</Link>
                </>
              )}
              {isMember && (
                <>
                  <Link to="/member-dashboard" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium text-foreground hover:text-green-500">Dashboard</Link>
                  <Link to="/notifications" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium text-foreground hover:text-green-500">Notifications ({unreadCount})</Link>
                  <button onClick={handleLogout} className="text-base font-medium text-destructive text-left">Logout</button>
                </>
              )}
              {isAdmin && (
                <>
                  <Link to="/admin-dashboard" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium text-foreground hover:text-green-500">Admin Dashboard</Link>
                  <Link to="/analytics" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium text-foreground hover:text-green-500">Analytics</Link>
                  <button onClick={handleLogout} className="text-base font-medium text-destructive text-left">Logout</button>
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