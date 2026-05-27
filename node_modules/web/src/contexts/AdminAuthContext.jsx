import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [token, setToken] = useState(pb.authStore.token || localStorage.getItem('adminToken'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadAdmin = async () => {
      const storedToken = localStorage.getItem('adminToken') || pb.authStore.token;

      if (pb.authStore.isValid && pb.authStore.model) {
        setCurrentAdmin(pb.authStore.model);
        setToken(pb.authStore.token);
        setLoading(false);
        return;
      } else if (storedToken) {
        try {
          pb.authStore.save(storedToken, pb.authStore.model || null);
          if (pb.authStore.isValid && pb.authStore.model) {
            setCurrentAdmin(pb.authStore.model);
            setToken(storedToken);
            setLoading(false);
            return;
          }
        } catch (error) {
          console.warn('Failed to restore admin token from storage:', error.message || error);
        }

        localStorage.removeItem('adminToken');
        localStorage.removeItem('pb_token');
        pb.authStore.clear();
        setToken(null);
        setCurrentAdmin(null);
      }
      setLoading(false);
    };

    loadAdmin();
  }, []);

  const fetchProfile = async () => {
    if (!pb.authStore.isValid) return null;

    try {
      const recordId = pb.authStore.model?.id;
      if (!recordId) {
        const auth = await pb.collection('pbc_admins_auth').authRefresh();
        if (!auth?.record) return null;
        setCurrentAdmin(auth.record);
        setToken(auth.token);
        localStorage.setItem('adminToken', auth.token);
        localStorage.setItem('pb_token', auth.token);
        return auth.record;
      }

      const admin = await pb.collection('pbc_admins_auth').getOne(recordId);
      setCurrentAdmin(admin);
      return admin;
    } catch (error) {
      console.error('Failed to fetch admin profile:', error.message || error);
      return null;
    }
  };

  const login = async (email, password) => {
    const auth = await pb.collection('pbc_admins_auth').authWithPassword(email, password);
    if (!auth || !auth.token) throw new Error('Invalid credentials');

    const data = { token: auth.token, admin: auth.record };
    setToken(data.token);
    setCurrentAdmin(data.admin);
    localStorage.setItem('adminToken', data.token);
    localStorage.setItem('pb_token', data.token);
    try {
      pb.authStore.save(data.token, data.admin);
    } catch (e) {
      console.error('Admin auth store save failed:', e);
    }

    return data;
  };

  const handleLogout = () => {
    setToken(null);
    setCurrentAdmin(null);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('pb_token');
  };

  const logout = async () => {
    pb.authStore.clear();
    handleLogout();
    navigate('/admin-login');
    toast.success('Logged out successfully');
  };

  return (
    <AdminAuthContext.Provider value={{
      currentAdmin,
      token,
      isAuthenticated: !!currentAdmin,
      login,
      logout,
      loading,
      fetchProfile,
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
