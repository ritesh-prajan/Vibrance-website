import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useFest } from '../../context/FestContext';
import { UserRole } from '../../types';

interface RequireAuthProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const RequireAuth: React.FC<RequireAuthProps> = ({
  children,
  allowedRoles,
}) => {
  const { currentUser } = useFest();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    if (currentUser.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    if (currentUser.role === 'gate_staff') {
      return <Navigate to="/verify" replace />;
    }
    return <Navigate to="/events" replace />;
  }

  return <>{children}</>;
};
