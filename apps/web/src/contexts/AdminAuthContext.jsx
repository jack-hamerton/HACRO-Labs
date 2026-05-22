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

  // Initialize admin from localStorage on mount
  useEffect(() => {
    const storedAdminData = localStorage.getItem('adminData');
    const storedToken = localStorage.getItem('adminToken');
    
    if (storedAdminData && storedToken) {
      try {
        const adminData = JSON.parse(storedAdminData);
        setCurrentAdmin(adminData);
        setToken(storedToken);
      } catch (error) {
        console.error('Error parsing stored admin data:', error);
        localStorage.removeItem('adminData');
        localStorage.removeItem('adminToken');
      }
    }
    
    setLoading(false);
  }, []);

  const fetchProfile = useCallback(async (authToken) => {
    try {
      const res = await apiServerClient.fetch('/admin/profile', {
        headers: { 'Authorization': `Bearer ${authToken}` }
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
    }
  }, []);

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
    
    // Store token and admin data
    localStorage.setItem('adminToken', data.token);
    localStorage.setItem('adminData', JSON.stringify(data.admin));
    
    setToken(data.token);
    setCurrentAdmin(data.admin);
    
    return data;
  };

  const handleLogout = () => {
    setToken(null);
    setCurrentAdmin(null);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
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

  const value = {
    currentAdmin,
    token,
    isAuthenticated: !!currentAdmin && !!token,
    login,
    logout,
    loading,
    fetchProfile
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 admin-theme">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminAuthContext.Provider value={value}>
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
