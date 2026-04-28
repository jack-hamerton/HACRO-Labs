import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Bell, Check, Trash2, Filter, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const NotificationCenter = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchNotifications();
  }, [currentUser]);

  const fetchNotifications = async () => {
    try {
      const records = await pb.collection('notifications').getFullList({
        filter: `member_id="${currentUser.id}"`,
        sort: '-created',
        $autoCancel: false
      });
      setNotifications(records);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await pb.collection('notifications').update(id, { read_status: true }, { $autoCancel: false });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read_status: true } : n));
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const deleteNotification = async (id) => {
    try {
      await pb.collection('notifications').delete(id, { $autoCancel: false });
      setNotifications(prev => prev.filter(n => n.id !== id));
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const filteredNotifications = notifications.filter(n => filterType === 'all' || n.type === filterType);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet><title>Notifications - Hacro Labs</title></Helmet>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Notifications</h1>
              <p className="text-muted-foreground">Stay updated on your group and loan activities.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="pl-9 pr-8 py-2 bg-card border border-border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="all">All Types</option>
                  <option value="loan_request">Loan Requests</option>
                  <option value="vote">Votes</option>
                  <option value="approval">Approvals</option>
                  <option value="disbursement">Disbursements</option>
                  <option value="repayment_due">Repayment Due</option>
                  <option value="penalty">Penalties</option>
                  <option value="message">Messages</option>
                </select>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">No notifications found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredNotifications.map(notif => (
                  <div key={notif.id} className={`p-5 rounded-xl border transition-colors ${notif.read_status ? 'bg-card border-border' : 'bg-primary/5 border-primary/20'}`}>
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold uppercase tracking-wider text-primary">{notif.type.replace('_', ' ')}</span>
                          {!notif.read_status && <span className="w-2 h-2 rounded-full bg-primary"></span>}
                        </div>
                        <h3 className="font-semibold text-foreground mb-1">{notif.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{notif.message}</p>
                        <p className="text-xs text-muted-foreground">{new Date(notif.created).toLocaleString()}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        {!notif.read_status && (
                          <button onClick={() => markAsRead(notif.id)} className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Mark as read">
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={() => deleteNotification(notif.id)} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default NotificationCenter;