import React, { createContext, useContext, useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (pb.authStore.isValid && pb.authStore.model) {
      setCurrentUser(pb.authStore.model);
      setUserRole(pb.authStore.model.collectionName);
    }
    setInitialLoading(false);
  }, []);

  const loginMember = async (email, password) => {
    const authData = await pb.collection('members').authWithPassword(email, password, { $autoCancel: false });
    setCurrentUser(authData.record);
    setUserRole('members');
    return authData;
  };

  const loginAdmin = async (email, password) => {
    const authData = await pb.collection('admins').authWithPassword(email, password, { $autoCancel: false });
    setCurrentUser(authData.record);
    setUserRole('admins');
    return authData;
  };

  const logout = () => {
    pb.authStore.clear();
    setCurrentUser(null);
    setUserRole(null);
  };

  const updateCurrentUser = (updatedUser) => {
    setCurrentUser(updatedUser);
  };

  const value = {
    currentUser,
    userRole,
    loginMember,
    loginAdmin,
    logout,
    updateCurrentUser,
    isAuthenticated: pb.authStore.isValid,
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