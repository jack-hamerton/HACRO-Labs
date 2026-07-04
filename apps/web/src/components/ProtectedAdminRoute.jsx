import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';
import { Loader2 } from 'lucide-react';

const ProtectedAdminRoute = ({ children, requireSuperAdmin = false, requiredPermission = null }) => {
  const { isAuthenticated, loading, isSuperAdmin, hasPermission } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 admin-theme">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin-login" replace />;
  }

  if (requireSuperAdmin && !isSuperAdmin) {
    return <Navigate to="/admin-dashboard" replace />;
  }

  if (requiredPermission && !isSuperAdmin && !hasPermission(requiredPermission)) {
    return <Navigate to="/admin-dashboard" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;
