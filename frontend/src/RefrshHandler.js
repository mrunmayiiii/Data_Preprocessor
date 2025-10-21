import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function RefrshHandler({ setIsAuthenticated }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      setIsAuthenticated(true);

      // Redirect only if user visits login or signup while already logged in
      if (location.pathname === '/login' || location.pathname === '/signup') {
        navigate('/dashboard', { replace: true });
      }
    } else {
      setIsAuthenticated(false);
    }
  }, [location, navigate, setIsAuthenticated]);

  return null;
}

export default RefrshHandler;
