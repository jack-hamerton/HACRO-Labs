import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, requireAdmin = false, requireMember = false }) => {
  const { isAuthenticated, isAdmin, isMember, currentUser } = useAuth();

  // Show loading state if user data is being fetched
  if (!currentUser && isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect to home if not authenticated
  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/" replace />;
  }

  // Check admin requirement
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Check member requirement
  if (requireMember && !isMember) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
