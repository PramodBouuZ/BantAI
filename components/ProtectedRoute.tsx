
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { User } from '../types';

interface ProtectedRouteProps {
  currentUser: User | null;
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user' | 'vendor';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  currentUser,
  children,
  requiredRole
}) => {
  const location = useLocation();

  if (!currentUser) {
    // Redirect to login but save the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole === 'admin' && currentUser.role !== 'admin') {
    // Unauthorized access to admin routes
    return <Navigate to="/user/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
