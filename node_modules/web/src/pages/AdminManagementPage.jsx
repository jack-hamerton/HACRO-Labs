import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Loader2, Plus, Edit, Trash2, Shield, Search, X } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import apiServerClient from '@/lib/apiServerClient.js';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';
import AdminLayout from '@/components/AdminLayout.jsx';

const AdminManagementPage = () => {
  const { token, currentAdmin } = useAdminAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [search, setSearch] = useState('');
  
  // Modal Data
  const [formData, setFormData] = useState({ full_name: '', email: '', role: 'admin', is_active: true });
  const [tempPassword, setTempPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const records = await pb.collection('admins').getFullList({ sort: '-created', $autoCancel: false });
      setAdmins(records);
    } catch (err) {
      toast.error('Failed to load admins');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (admin = null) => {
    setTempPassword('');
    if (admin) {
      setEditingAdmin(admin);
      setFormData({ full_name: admin.full_name, email: admin.email, role: admin.role, is_active: admin.is_active });
    } else {
      setEditingAdmin(null);
      setFormData({ full_name: '', email: '', role: 'admin', is_active: true });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTempPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      if (editingAdmin) {
        // Update
        const res = await apiServerClient.fetch(`/admin/${editingAdmin.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(formData)
        });
        if (!res.ok) throw new Error((await res.json()).error);
        toast.success('Admin updated successfully');
        closeModal();
      } else {
        // Create
        const res = await apiServerClient.fetch(`/admin/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(formData)
        });
        if (!res.ok) throw new Error((await res.json()).error);
        const data = await res.json();
        setTempPassword(data.temporaryPassword);
        toast.success('Admin created successfully');
        // Do not close modal yet, so they can copy the password
      }
      fetchAdmins();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = (admin) => {
    setEditingAdmin(admin);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      const res = await apiServerClient.fetch(`/admin/${editingAdmin.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success('Admin deleted securely');
      setIsDeleteModalOpen(false);
      fetchAdmins();
    } catch (err) {
      toast.error(err.message || 'Failed to delete admin');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStatus = async (admin) => {
    try {
      const res = await apiServerClient.fetch(`/admin/${admin.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ is_active: !admin.is_active })
      });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success(`Admin ${admin.is_active ? 'deactivated' : 'activated'}`);
      fetchAdmins();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    }
  };

  const filteredAdmins = admins.filter(a => 
    a.full_name.toLowerCase().includes(search.toLowerCase()) || 
    a.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <Helmet><title>Manage Admins - Hacro Labs</title></Helmet>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">System Administrators</h2>
            <p className="text-slate-500 mt-1">Manage platform access and administrative roles.</p>
          </div>
          <button onClick={() => openModal()} className="bg-blue-600 text-white px-4 py-2.5 rounded-xl font-medium flex items-center hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4 mr-2" /> Add New Admin
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search admins..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 font-semibold text-slate-700">Admin</th>
                    <th className="px-6 py-3 font-semibold text-slate-700">Role</th>
                    <th className="px-6 py-3 font-semibold text-slate-700">Status</th>
                    <th className="px-6 py-3 font-semibold text-slate-700">Last Login</th>
                    <th className="px-6 py-3 font-semibold text-slate-700 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAdmins.map(admin => (
                    <tr key={admin.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{admin.full_name}</div>
                        <div className="text-slate-500">{admin.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${admin.role === 'super_admin' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                          {admin.role === 'super_admin' && <Shield className="w-3 h-3" />}
                          {admin.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${admin.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                          {admin.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {admin.last_login ? new Date(admin.last_login).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <button onClick={() => toggleStatus(admin)} disabled={admin.id === currentAdmin.id} className="text-xs font-medium text-slate-500 hover:text-slate-900 px-2 py-1 border border-slate-200 rounded hover:bg-slate-100 disabled:opacity-50 transition-colors">
                             {admin.is_active ? 'Deactivate' : 'Activate'}
                           </button>
                           <button onClick={() => openModal(admin)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                             <Edit className="w-4 h-4" />
                           </button>
                           <button onClick={() => confirmDelete(admin)} disabled={admin.id === currentAdmin.id} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50">
                             <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredAdmins.length === 0 && (
                    <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">No administrators found.</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">{editingAdmin ? 'Edit Administrator' : 'Add New Administrator'}</h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-700 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            
            {tempPassword ? (
              <div className="p-6">
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                  <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h4 className="text-lg font-bold text-green-800 mb-2">Admin Created Successfully</h4>
                  <p className="text-sm text-green-700 mb-4">Please share this temporary password securely. They will be required to change it upon first login.</p>
                  <div className="bg-white border border-green-200 p-3 rounded-lg font-mono text-lg font-bold text-slate-900 tracking-wider">
                    {tempPassword}
                  </div>
                </div>
                <button onClick={closeModal} className="w-full mt-6 py-2.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800">Done</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                  <input type="text" required value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
                  <input type="email" required disabled={!!editingAdmin} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all disabled:opacity-50" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Role</label>
                  <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all">
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>
                
                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button type="button" onClick={closeModal} className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors">Cancel</button>
                  <button type="submit" disabled={submitting} className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex justify-center items-center">
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingAdmin ? 'Save Changes' : 'Create Admin')}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Administrator</h3>
            <p className="text-sm text-slate-500 mb-6">Are you sure you want to permanently delete <strong>{editingAdmin?.full_name}</strong>? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors">Cancel</button>
              <button onClick={handleDelete} disabled={submitting} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors flex justify-center items-center">
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminManagementPage;