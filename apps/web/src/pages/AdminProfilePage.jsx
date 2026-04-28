import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Loader2, KeyRound, User, Smartphone, LogIn, Activity } from 'lucide-react';
import { toast } from 'sonner';
import apiServerClient from '@/lib/apiServerClient.js';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';
import AdminLayout from '@/components/AdminLayout.jsx';

const AdminProfilePage = () => {
  const { currentAdmin, token, fetchProfile } = useAdminAuth();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({ full_name: '', phone: '' });
  const [pwdData, setPwdData] = useState({ currentPassword: '', newPassword: '' });
  
  const [loginHistory, setLoginHistory] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    if (currentAdmin) {
      setProfileData({ full_name: currentAdmin.full_name || '', phone: currentAdmin.phone || '' });
      fetchHistory();
    }
  }, [currentAdmin]);

  const fetchHistory = async () => {
    try {
      const [histRes, actRes] = await Promise.all([
        apiServerClient.fetch('/admin/login-history', { headers: { Authorization: `Bearer ${token}` } }),
        apiServerClient.fetch('/admin/activity-log?limit=5', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      if (histRes.ok) setLoginHistory((await histRes.json()).sessions || []);
      if (actRes.ok) setRecentActivity((await actRes.json()).records || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiServerClient.fetch('/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(profileData)
      });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success('Profile updated successfully');
      fetchProfile();
    } catch (err) {
      toast.error(err.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePwdSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiServerClient.fetch('/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(pwdData)
      });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success('Password changed successfully');
      setPwdData({ currentPassword: '', newPassword: '' });
    } catch (err) {
      toast.error(err.message || 'Password change failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <Helmet><title>Admin Profile - Hacro Labs</title></Helmet>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Forms */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-900">Profile Details</h3>
            </div>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                <input type="text" value={profileData.full_name} onChange={e => setProfileData({...profileData, full_name: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
                <input type="email" value={currentAdmin?.email || ''} disabled className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Phone Number</label>
                <input type="text" value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" />
              </div>
              <button type="submit" disabled={loading} className="w-full py-2.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 flex justify-center items-center mt-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
              </button>
            </form>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <KeyRound className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-900">Change Password</h3>
            </div>
            <form onSubmit={handlePwdSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Current Password</label>
                <input type="password" value={pwdData.currentPassword} onChange={e => setPwdData({...pwdData, currentPassword: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">New Password</label>
                <input type="password" value={pwdData.newPassword} onChange={e => setPwdData({...pwdData, newPassword: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" required />
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">Min 8 chars, uppercase, lowercase, number, special char required.</p>
              </div>
              <button type="submit" disabled={loading} className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 flex justify-center items-center mt-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update Password'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: History & Logs */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center gap-3">
              <LogIn className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-900">Recent Login History</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 font-semibold text-slate-700">Date & Time</th>
                    <th className="px-6 py-3 font-semibold text-slate-700">IP Address</th>
                    <th className="px-6 py-3 font-semibold text-slate-700">Device Info</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loginHistory.slice(0, 5).map((log, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="px-6 py-3 text-slate-900 font-medium">{new Date(log.created_date).toLocaleString()}</td>
                      <td className="px-6 py-3 text-slate-500 font-mono text-xs">{log.ip_address || 'Unknown'}</td>
                      <td className="px-6 py-3 text-slate-500 text-xs truncate max-w-[200px]">{log.user_agent || 'Unknown Device'}</td>
                    </tr>
                  ))}
                  {loginHistory.length === 0 && <tr><td colSpan="3" className="p-6 text-center text-slate-500">No recent logins.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center gap-3">
              <Activity className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-900">Recent Account Activity</h3>
            </div>
            <div className="p-2">
              {recentActivity.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {recentActivity.map(act => (
                    <div key={act.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50 rounded-lg transition-colors">
                      <div>
                        <p className="font-medium text-slate-900">{act.description}</p>
                        <p className="text-xs text-slate-500 mt-1 capitalize font-mono bg-slate-100 inline-block px-1.5 py-0.5 rounded">{act.action.replace('_', ' ')}</p>
                      </div>
                      <span className="text-xs text-slate-400 font-medium whitespace-nowrap">{new Date(act.timestamp).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="p-6 text-center text-slate-500">No recent activity.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminProfilePage;