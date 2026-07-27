import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser, getAuthToken } from '../services/api';

export default function ProtectedRoute({ children, roles = [] }) {
  const user = getCurrentUser();
  const token = getAuthToken();

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
