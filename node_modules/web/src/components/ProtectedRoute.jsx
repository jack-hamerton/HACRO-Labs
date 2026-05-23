import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';

const ProtectedRoute = ({ children, requireAdmin = false, requireMember = false }) => {
  const { isAuthenticated, isAdmin, isMember } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (requireMember && !isMember) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
