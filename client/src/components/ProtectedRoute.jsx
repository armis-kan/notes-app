import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from '../services/tokenService';

const ProtectedRoute = ({ children }) => {
  const token = getToken();
  if (!token) {
    return <Navigate to="/auth" />;
  }
  return children;
};

export default ProtectedRoute;