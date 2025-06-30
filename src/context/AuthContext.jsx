import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Objek user bisa menyimpan peran
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = localStorage.getItem('authToken');
    return !!token;
  });

  const [authToken, setAuthToken] = useState(() => {
    return localStorage.getItem('authToken');
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      try {
        return JSON.parse(userDataString);
      } catch (e) {
        console.error(
          'Failed to parse user data from localStorage during initial load',
          e,
        );
        localStorage.removeItem('userData'); // Hapus data rusak jika ada
        return null;
      }
    }
    return null;
  });

  const setRedirectPath = (path) => {
    if (path && path !== '/login') { // Hindari menyimpan path login sebagai redirect
      localStorage.setItem('redirectPath', path);
      console.log('Redirect path set to:', path);
    }
  };

  const getRedirectPath = () => {
    const path = localStorage.getItem('redirectPath');
    console.log('Retrieved redirect path:', path);
    return path;
  };

  const clearRedirectPath = () => {
    localStorage.removeItem('redirectPath');
    console.log('Redirect path cleared.');
  };

  // Efek samping untuk mendengarkan perubahan localStorage dari tab/jendela lain.
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('authToken');
      const userDataString = localStorage.getItem('userData');

      setIsLoggedIn(!!token);
      setAuthToken(token);

      if (userDataString) {
        try {
          setCurrentUser(JSON.parse(userDataString));
        } catch (e) {
          console.error(
            'Failed to parse user data from localStorage on storage event',
            e,
          );
          localStorage.removeItem('userData');
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // Dependency array kosong agar hanya berjalan sekali saat mount dan cleanup saat unmount

  // Fungsi login: Sekarang menerima token dan userData sebagai argumen
  const login = (token, userData) => {
    // Simpan ke localStorage
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));

    // Perbarui state lokal di context
    setIsLoggedIn(true);
    setAuthToken(token);
    setCurrentUser(userData);
  };

  const logout = () => {
    // Hapus dari state lokal
    setIsLoggedIn(false);
    setAuthToken(null);
    setCurrentUser(null);

    // Hapus dari localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  };

  const isAdmin = currentUser?.is_admin === 1 || false;

  return (
    <AuthContext.Provider
      value={{ 
        isLoggedIn, 
        login, 
        logout, 
        authToken, 
        currentUser, 
        isAdmin,
        setRedirectPath,    // Tambahkan ke context
        getRedirectPath,    // Tambahkan ke context
        clearRedirectPath   // Tambahkan ke context 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
