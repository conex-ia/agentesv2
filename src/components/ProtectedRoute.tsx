import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../stores/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const { userUid, empresaUid } = useAuth();

  if (!userUid || !empresaUid) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;