import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import hook useAuth

const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = useAuth(); // Dapatkan status login dari AuthContext

  if (!isLoggedIn) {
    // Jika belum login, redirect ke halaman login
    return <Navigate to="/login" replace />;
  }

  // Jika sudah login, render children (komponen halaman yang dilindungi)
  return children;
};

export default PrivateRoute;
