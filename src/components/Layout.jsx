// src/components/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom'; // Import Outlet

import Header from './Header'; // Pastikan path benar
import Footer from './Footer'; // Pastikan path benar

function Layout({ isLoggedIn, onLogout }) {
  // Menerima props isLoggedIn dan onLogout
  return (
    // min-h-screen dan flex flex-col untuk layout sticky footer
    <div className="min-h-screen flex flex-col font-sans antialiased text-gray-800">
      {/* Header akan selalu ada */}
      <Header isLoggedIn={isLoggedIn} onLogout={onLogout} />{' '}
      {/* Teruskan props ke Header */}
      {/* Outlet akan merender komponen halaman yang sesuai dengan rute */}
      <Outlet /> {/* Ini penting! Halaman akan dirender di sini */}
      {/* Footer akan selalu ada */}
      <Footer />
    </div>
  );
}

export default Layout;
