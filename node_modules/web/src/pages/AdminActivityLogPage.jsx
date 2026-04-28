import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Loader2, Activity, Search, Filter, Download } from 'lucide-react';
import { toast } from 'sonner';
import apiServerClient from '@/lib/apiServerClient.js';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';
import AdminLayout from '@/components/AdminLayout.jsx';

const AdminActivityLogPage = () => {
  const { token } = useAdminAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', action: '', page: 1, limit: 20 });
  const [totalItems, setTotalItems] = useState(0);

  const ACTIONS = ['login', 'logout', 'loan_disbursed', 'admin_added', 'admin_deleted', 'admin_updated', 'member_updated', 'group_created', 'group_updated', 'password_changed'];

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: filters.page,
        limit: filters.limit,
        ...(filters.action && { action: filters.action }),
        ...(filters.search && { search: filters.search })
      });
      
      const res = await apiServerClient.fetch(`/admin/activity-log?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error('Failed to fetch logs');
      const data = await res.json();
      setLogs(data.records || []);
      setTotalItems(data.total || 0);
    } catch (err) {
      toast.error('Failed to load activity logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchLogs();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [filters.search, filters.action, filters.page]);

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Date,Action,Description,IP Address\n"
      + logs.map(e => `"${new Date(e.timestamp).toLocaleString()}","${e.action}","${e.description}","${e.ip_address || ''}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `admin_audit_log_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout>
      <Helmet><title>Activity Log - Hacro Labs</title></Helmet>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Audit Trail</h2>
            <p className="text-slate-500 mt-1">Review all system administrator actions for security compliance.</p>
          </div>
          <button onClick={exportCSV} className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-medium flex items-center hover:bg-slate-50 transition-colors shadow-sm">
            <Download className="w-4 h-4 mr-2" /> Export Log
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search descriptions..." 
                value={filters.search}
                onChange={e => setFilters({...filters, search: e.target.value, page: 1})}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none"
              />
            </div>
            <div className="relative min-w-[200px]">
              <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <select 
                value={filters.action}
                onChange={e => setFilters({...filters, action: e.target.value, page: 1})}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none appearance-none"
              >
                <option value="">All Actions</option>
                {ACTIONS.map(a => <option key={a} value={a}>{a.replace('_', ' ').toUpperCase()}</option>)}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto relative min-h-[400px]">
            {loading && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            )}
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold text-slate-700">Date & Time</th>
                  <th className="px-6 py-4 font-semibold text-slate-700">Action Type</th>
                  <th className="px-6 py-4 font-semibold text-slate-700">Description</th>
                  <th className="px-6 py-4 font-semibold text-slate-700">IP Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 text-slate-900 font-medium whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-slate-100 text-slate-600 border border-slate-200">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-700">{log.description}</td>
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">{log.ip_address || 'N/A'}</td>
                  </tr>
                ))}
                {!loading && logs.length === 0 && (
                  <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-500">No activity logs match your criteria.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {totalItems > filters.limit && (
            <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-white">
              <span className="text-sm text-slate-500">Showing {logs.length} of {totalItems}</span>
              <div className="flex gap-2">
                <button 
                  disabled={filters.page === 1} 
                  onClick={() => setFilters({...filters, page: filters.page - 1})}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >Previous</button>
                <button 
                  disabled={filters.page * filters.limit >= totalItems} 
                  onClick={() => setFilters({...filters, page: filters.page + 1})}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >Next</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminActivityLogPage;