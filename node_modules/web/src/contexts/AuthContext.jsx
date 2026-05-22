import React, { createContext, useContext, useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';
import apiServerClient from '@/lib/apiServerClient.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    // Check if token exists in localStorage (for member login)
    const token = localStorage.getItem('memberToken');
    const userData = localStorage.getItem('memberData');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        setCurrentUser(user);
        setUserRole('members');
      } catch (error) {
        console.error('Error parsing stored member data:', error);
        localStorage.removeItem('memberToken');
        localStorage.removeItem('memberData');
      }
    }
    
    setInitialLoading(false);
  }, []);

  const loginMember = async (email, password) => {
    const res = await apiServerClient.fetch('/members/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || 'Invalid credentials');

    // Store token and user data in localStorage
    localStorage.setItem('memberToken', data.token);
    localStorage.setItem('memberData', JSON.stringify(data.member));
    
    // Update context state
    setCurrentUser(data.member);
    setUserRole('members');
    
    return data;
  };

  const loginAdmin = async (email, password) => {
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

    // Store token and admin data in localStorage
    localStorage.setItem('adminToken', data.token);
    localStorage.setItem('adminData', JSON.stringify(data.admin));
    
    // Update context state
    setCurrentUser(data.admin);
    setUserRole('admins');
    
    return data;
  };

  const logout = () => {
    localStorage.removeItem('memberToken');
    localStorage.removeItem('memberData');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    setCurrentUser(null);
    setUserRole(null);
  };

  const updateCurrentUser = (updatedUser) => {
    setCurrentUser(updatedUser);
    if (userRole === 'members') {
      localStorage.setItem('memberData', JSON.stringify(updatedUser));
    } else if (userRole === 'admins') {
      localStorage.setItem('adminData', JSON.stringify(updatedUser));
    }
  };

  const value = {
    currentUser,
    userRole,
    loginMember,
    loginAdmin,
    logout,
    updateCurrentUser,
    isAuthenticated: !!currentUser && !!userRole,
    isMember: userRole === 'members',
    isAdmin: userRole === 'admins',
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
