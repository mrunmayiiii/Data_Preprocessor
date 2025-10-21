import React from 'react';
import { Navigate } from 'react-router-dom';

function isJwtValid(token) {
  if (
    !token ||
    typeof token !== 'string' ||
    token === 'undefined' ||
    token === 'null' ||
    token.trim() === ''
  ) {
    return false;
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    return false;
  }

  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const payloadJson = typeof atob === 'function' ? atob(base64) : Buffer.from(base64, 'base64').toString('binary');
    const payload = JSON.parse(payloadJson);

    if (payload && typeof payload.exp === 'number') {
      const nowInSeconds = Math.floor(Date.now() / 1000);
      if (nowInSeconds >= payload.exp) {
        return false;
      }
    }
  } catch (e) {
    return false;
  }

  return true;
}

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!isJwtValid(token)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
