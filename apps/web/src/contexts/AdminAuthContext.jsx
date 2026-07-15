import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient.js';
import apiServerClient from '@/lib/apiServerClient.js';
import { toast } from 'sonner';

const AdminAuthContext = createContext(null);
const SUPERADMIN_EMAIL = import.meta.env.VITE_SUPERADMIN_EMAIL || '';
const SUPERADMIN_NAME = import.meta.env.VITE_SUPERADMIN_NAME || 'Super Admin';
const DEFAULT_PERMISSIONS = [
  'manage_admins',
  'manage_members',
  'manage_loans',
  'manage_payments',
  'manage_withdrawals',
  'view_analytics',
  'manage_newsletters',
  'manage_company_accounts',
  'view_activity_log',
  'manage_profile',
  'manage_tasks',
  'manage_messaging',
];

const parsePermissions = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      

    }
    return value.split(',').map((item) => item.trim()).filter(Boolean);
  }
  return [];
};

const normalizeAdminRecord = (record) => {
  if (!record) return null;

  const isSuperAdmin = record.role === 'super_admin' || record.email === SUPERADMIN_EMAIL;
  const fullName = record.full_name || [record.first_name, record.last_name].filter(Boolean).join(' ').trim() || (record.email === SUPERADMIN_EMAIL ? SUPERADMIN_NAME : record.email || 'Admin');
  const permissions = parsePermissions(record.permissions || []);

  return {
    ...record,
    full_name: fullName,
    role: isSuperAdmin ? 'super_admin' : 'admin',
    permissions: isSuperAdmin && permissions.length === 0 ? DEFAULT_PERMISSIONS : permissions,
  };
};

export const AdminAuthProvider = ({ children }) => {
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('adminToken') || null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadAdmin = async () => {
      const storedToken = localStorage.getItem('adminToken') || pb.authStore.token;

      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await apiServerClient.fetch('/admin/profile', {
          headers: { Authorization: `Bearer ${storedToken}` },
        });

        if (!res.ok) throw new Error('Failed to restore admin session');

        const profile = await res.json();
        const normalizedAdmin = normalizeAdminRecord(profile);
        setCurrentAdmin(normalizedAdmin);
        setToken(storedToken);
        localStorage.setItem('adminToken', storedToken);
        localStorage.setItem('pb_token', storedToken);
        pb.authStore.save(storedToken, null);
      } catch (error) {
        console.warn('Failed to restore admin token from storage:', error.message || error);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('pb_token');
        pb.authStore.clear();
        setToken(null);
        setCurrentAdmin(null);
      } finally {
        setLoading(false);
      }
    };

    loadAdmin();
  }, []);

  const fetchProfile = async () => {
    const storedToken = token || localStorage.getItem('adminToken');
    if (!storedToken) return null;

    try {
      const res = await apiServerClient.fetch('/admin/profile', {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      if (!res.ok) throw new Error('Failed to fetch profile');

      const profile = await res.json();
      const normalized = normalizeAdminRecord(profile);
      setCurrentAdmin(normalized);
      setToken(storedToken);
      localStorage.setItem('adminToken', storedToken);
      localStorage.setItem('pb_token', storedToken);
      return normalized;
    } catch (error) {
      console.error('Failed to fetch admin profile:', error.message || error);
      return null;
    }
  };

  const login = async (email, password) => {
    const res = await apiServerClient.fetch('/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Invalid credentials');
    }

    const data = await res.json();
    const normalizedAdmin = normalizeAdminRecord(data.admin);
    const nextToken = data.token;

    setToken(nextToken);
    setCurrentAdmin(normalizedAdmin);
    localStorage.setItem('adminToken', nextToken);
    localStorage.setItem('pb_token', nextToken);
    pb.authStore.save(nextToken, null);

    return { token: nextToken, admin: normalizedAdmin };
  };

  const clearSession = () => {
    setToken(null);
    setCurrentAdmin(null);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('pb_token');
    pb.authStore.clear();
  };

  const logout = async () => {
    if (token) {
      try {
        await apiServerClient.fetch('/admin/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
      } catch (error) {
        console.warn('Admin logout API call failed:', error.message || error);
      }
    }

    clearSession();
    navigate('/admin-login');
    toast.success('Logged out successfully');
  };

  const currentPermissions = currentAdmin ? parsePermissions(currentAdmin.permissions) : [];
  const isSuperAdmin = Boolean(currentAdmin && (currentAdmin.role === 'super_admin' || currentAdmin.email === SUPERADMIN_EMAIL));
  const hasPermission = (permission) => isSuperAdmin || currentPermissions.includes(permission);

  return (
    <AdminAuthContext.Provider value={{
      currentAdmin,
      token,
      isAuthenticated: !!currentAdmin,
      login,
      logout,
      loading,
      fetchProfile,
      currentPermissions,
      hasPermission,
      isSuperAdmin,
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};
