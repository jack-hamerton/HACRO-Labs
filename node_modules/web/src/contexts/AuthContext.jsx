import React, { createContext, useContext, useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  const resolveUserRole = (model) => {
    if (!model) return null;
    if (model.collectionName === 'members') return 'members';
    if (['pbc_admins_auth', '_superusers', 'admins'].includes(model.collectionName)) return 'admins';
    return model.collectionName;
  };

  useEffect(() => {
    if (pb.authStore.isValid && pb.authStore.model) {
      setCurrentUser(pb.authStore.model);
      setUserRole(resolveUserRole(pb.authStore.model));
    }
    setInitialLoading(false);
  }, []);

  const loginMember = async (identity, password) => {
    const rawIdentity = String(identity || '').trim();
    const normalized = rawIdentity.replace(/\s+/g, '');
    const isPhone = /^\+?[0-9]{9,15}$/.test(normalized);

    let auth;
    if (isPhone) {
      const phone = normalized.replace(/^\+/, '');
      const members = await pb.collection('members').getFullList({
        filter: `phone = "${phone}"`,
      });
      if (members.length !== 1) {
        throw new Error('Invalid credentials');
      }
      auth = await pb.collection('members').authWithPassword(members[0].email, password);
    } else {
      auth = await pb.collection('members').authWithPassword(normalized, password);
    }

    if (!auth || !auth.token) throw new Error('Invalid credentials');

    pb.authStore.save(auth.token, auth.record);
    setCurrentUser(auth.record);
    setUserRole('members');
    return { token: auth.token, member: auth.record };
  };

  const loginAdmin = async (email, password) => {
    const auth = await pb.collection('pbc_admins_auth').authWithPassword(email, password);
    if (!auth || !auth.token) throw new Error('Invalid credentials');

    pb.authStore.save(auth.token, auth.record);
    setCurrentUser(auth.record);
    setUserRole('admins');
    return { token: auth.token, admin: auth.record };
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
