// src/components/AdminLayout.jsx
import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Sesuaikan path jika berbeda

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect ke halaman login setelah logout
  };

  return (
    <div className="flex flex-col min-h-screen font-sans">
      {/* Header Admin */}
      <header className="bg-gray-800 text-white p-4 shadow-md flex justify-between items-center rounded-b-lg">
        <h1 className="text-3xl font-bold tracking-wide">Admin Panel</h1>
        <nav>
          <ul className="flex space-x-6 text-lg">
            <li>
              <Link to="/admin" className="hover:text-blue-400 transition duration-300 ease-in-out">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/admin/users" className="hover:text-blue-400 transition duration-300 ease-in-out">
                Manajemen Pengguna
              </Link>
            </li>
            <li>
              <Link to="/admin/products" className="hover:text-blue-400 transition duration-300 ease-in-out">
                Manajemen Produk
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-full transition duration-300 ease-in-out shadow-lg"
              >
                Logout
              </button>
            </li>
            <li>
              <Link
                to="/"
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full transition duration-300 ease-in-out shadow-lg"
              >
                Ke Situs Utama
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow p-6 bg-gray-50">
        <Outlet /> {/* Ini akan merender komponen anak yang cocok */}
      </main>

      {/* Footer Admin */}
      <footer className="bg-gray-800 text-white p-4 text-center rounded-t-lg">
        <p className="text-sm">&copy; 2024 Admin Panel. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AdminLayout;
