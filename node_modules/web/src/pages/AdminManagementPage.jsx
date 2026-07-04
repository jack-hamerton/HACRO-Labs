import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Loader2, Shield, PlusCircle, Trash2, PencilLine, CheckCircle2, UserCog } from 'lucide-react';
import { toast } from 'sonner';
import apiServerClient from '@/lib/apiServerClient.js';
import AdminLayout from '@/components/AdminLayout.jsx';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';

const PERMISSION_OPTIONS = [
  { key: 'manage_admins', label: 'Manage admins' },
  { key: 'manage_members', label: 'Manage members' },
  { key: 'manage_loans', label: 'Manage loans' },
  { key: 'manage_payments', label: 'Manage payments' },
  { key: 'manage_withdrawals', label: 'Manage withdrawals' },
  { key: 'view_analytics', label: 'View analytics' },
  { key: 'manage_newsletters', label: 'Manage newsletters' },
  { key: 'manage_company_accounts', label: 'Manage company accounts' },
  { key: 'view_activity_log', label: 'View activity log' },
  { key: 'manage_profile', label: 'Manage profile' },
];

const emptyForm = () => ({
  full_name: '',
  email: '',
  password: '',
  role: 'admin',
  is_active: true,
  permissions: [],
});

const AdminManagementPage = () => {
  const { currentAdmin, token } = useAdminAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm());

  useEffect(() => {
    if (token) {
      fetchAdmins();
    } else {
      setLoading(false);
      setAdmins([]);
    }
  }, [token]);

  const fetchAdmins = async () => {
    try {
      const res = await apiServerClient.fetch('/admin', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load admins');
      const data = await res.json();
      setAdmins(Array.isArray(data.admins) ? data.admins : []);
    } catch (err) {
      toast.error(err?.message || 'Failed to load admins');
    } finally {
      setLoading(false);
    }
  };

  const parsePermissions = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // ignore and fall back to split
      }
      return value.split(',').map((item) => item.trim()).filter(Boolean);
    }
    return [];
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.full_name || !formData.email || (!editingId && !formData.password)) {
      toast.error('Please complete the admin details before saving.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        full_name: formData.full_name,
        email: formData.email,
        role: formData.role,
        is_active: formData.is_active,
        permissions: formData.permissions,
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      const res = await apiServerClient.fetch(editingId ? `/admin/${editingId}` : '/admin/register', {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to save admin.');

      if (!editingId) {
        toast.success(data.temporaryPassword ? `Admin account created. Temporary password: ${data.temporaryPassword}` : 'Admin account created.');
      } else {
        toast.success('Admin account updated.');
      }

      setEditingId(null);
      setFormData(emptyForm());
      await fetchAdmins();
    } catch (err) {
      toast.error(err?.message || 'Failed to save admin.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (admin) => {
    setEditingId(admin.id);
    setFormData({
      full_name: admin.full_name || '',
      email: admin.email || '',
      password: '',
      role: admin.role || 'admin',
      is_active: admin.is_active !== false,
      permissions: parsePermissions(admin.permissions || []),
    });
  };

  const handleDelete = async (admin) => {
    if (admin.id === currentAdmin?.id) {
      toast.error('You cannot delete your own admin account.');
      return;
    }
    if (!window.confirm(`Remove ${admin.full_name || admin.email} from the admin portal?`)) return;

    try {
      const res = await apiServerClient.fetch(`/admin/${admin.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to remove admin.');
      toast.success('Admin removed successfully.');
      await fetchAdmins();
    } catch (err) {
      toast.error(err?.message || 'Failed to remove admin.');
    }
  };

  const togglePermission = (permissionKey) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permissionKey)
        ? prev.permissions.filter((item) => item !== permissionKey)
        : [...prev.permissions, permissionKey],
    }));
  };

  return (
    <AdminLayout>
      <Helmet><title>Manage Admins - Hacro Labs</title></Helmet>

      <div className="max-w-7xl mx-auto space-y-6">
        <div className="rounded-[28px] border border-emerald-200 bg-gradient-to-br from-white to-emerald-50 p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
                <Shield className="h-4 w-4" />
                Super admin controls
              </div>
              <h2 className="mt-3 text-2xl font-bold text-slate-900 tracking-tight">System administrators</h2>
              <p className="mt-2 text-sm text-slate-600">Create new admin accounts, remove old ones, and assign the portal permissions each admin should see and use.</p>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
              <p className="font-semibold text-slate-900">Current super admin</p>
              <p className="mt-1">{currentAdmin?.full_name || 'Jack Hamerton'}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-slate-900">
              <UserCog className="h-5 w-5 text-emerald-600" />
              <h3 className="text-lg font-semibold">{editingId ? 'Update admin access' : 'Create a new admin'}</h3>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Full name</label>
                  <input value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 focus:border-emerald-500 focus:outline-none" placeholder="Jack Hamerton" required />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 focus:border-emerald-500 focus:outline-none" placeholder="admin@hacrolabs.com" required />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
                  <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 focus:border-emerald-500 focus:outline-none" placeholder={editingId ? 'Leave blank to keep current password' : 'Set a secure password'} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Role</label>
                  <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 focus:border-emerald-500 focus:outline-none">
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super admin</option>
                  </select>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-700">Portal permissions</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {PERMISSION_OPTIONS.map((option) => (
                    <label key={option.key} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                      <input type="checkbox" checked={formData.permissions.includes(option.key)} onChange={() => togglePermission(option.key)} className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlusCircle className="h-4 w-4" />}
                  {editingId ? 'Save admin' : 'Create admin'}
                </button>
                {editingId && (
                  <button type="button" onClick={() => { setEditingId(null); setFormData(emptyForm()); }} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50">Cancel</button>
                )}
              </div>
            </form>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 p-5">
              <h3 className="text-lg font-semibold text-slate-900">Admin roster</h3>
              <p className="mt-1 text-sm text-slate-500">Manage access and remove inactive or old accounts.</p>
            </div>
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-emerald-600" /></div>
            ) : (
              <div className="divide-y divide-slate-100">
                {admins.map((admin) => {
                  const isSuper = admin.role === 'super_admin' || admin.email === 'hamertonotieno99@gmail.com';
                  return (
                    <div key={admin.id} className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-slate-900">{admin.full_name || admin.email}</p>
                          {isSuper && <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700"><Shield className="h-3 w-3" /> Super</span>}
                        </div>
                        <p className="mt-1 text-sm text-slate-500">{admin.email}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${admin.is_active === false ? 'bg-slate-100 text-slate-600' : 'bg-emerald-100 text-emerald-700'}`}>
                            {admin.is_active === false ? 'Inactive' : 'Active'}
                          </span>
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">{admin.role === 'super_admin' ? 'Super admin' : 'Admin'}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button type="button" onClick={() => handleEdit(admin)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50">
                          <PencilLine className="h-4 w-4" /> Edit
                        </button>
                        <button type="button" onClick={() => handleDelete(admin)} className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50">
                          <Trash2 className="h-4 w-4" /> Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
                {admins.length === 0 && <div className="p-6 text-center text-sm text-slate-500">No admin accounts found yet.</div>}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminManagementPage;
