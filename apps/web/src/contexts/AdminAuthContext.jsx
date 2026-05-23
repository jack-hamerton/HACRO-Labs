import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import apiServerClient from '@/lib/apiServerClient.js';
import { toast } from 'sonner';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProfile = useCallback(async () => {
    try {
      const res = await apiServerClient.fetch('/admin/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const admin = await res.json();
        setCurrentAdmin(admin);
      } else {
        throw new Error('Invalid session');
      }
    } catch (err) {
      console.error('Session error:', err);
      handleLogout();
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [token, fetchProfile]);

  const login = async (email, password) => {
    const res = await apiServerClient.fetch('/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await res.json();
    
    if (res.status === 429) {
      throw new Error('Too many failed attempts. Please try again in 15 minutes.');
    }
    
    if (!res.ok) throw new Error(data.error || 'Invalid credentials');
    
    setToken(data.token);
    setCurrentAdmin(data.admin);
    localStorage.setItem('adminToken', data.token);
    
    // Store token for API requests
    localStorage.setItem('pb_token', data.token);
    
    return data;
  };

  const handleLogout = () => {
    setToken(null);
    setCurrentAdmin(null);
    localStorage.removeItem('adminToken');
  };

  const logout = async () => {
    if (token) {
      try {
        await apiServerClient.fetch('/admin/logout', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ token })
        });
      } catch (e) {
        console.error('Logout error:', e);
      }
    }
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
      fetchProfile
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
