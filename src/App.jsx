import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/HomePage';
import Product from './pages/ProductPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import TransactionListPage from './pages/TransactionListPage';
import Login from './pages/LoginPage';
import Profile from './pages/ProfilePage';
import UserList from './pages/UserList';
import UserAdd from './pages/UserAdd.jsx';
import CartPage from './pages/CartPage/CartPage';

// Import komponen Admin
import AdminLayout from './components/AdminLayout';
import AdminDashboardPage from './pages/AdminPages.jsx'; // Sesuaikan path
// import AdminUsersPage from './pages/AdminUsersPage';       // Sesuaikan path
// import AdminProductsPage from './pages/AdminProductsPage'; // Tambahkan ini

import './App.css'; // Pastikan CSS global ada

// Komponen PrivateRoute untuk melindungi rute umum
const PrivateRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-xl">Loading authentication...</div>;
  }

  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

// Komponen AdminPrivateRoute untuk melindungi rute admin
const AdminPrivateRoute = ({ children }) => {
  const { isLoggedIn, isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-xl">Loading authentication...</div>;
  }

  // Jika tidak login, redirect ke halaman login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  // Jika login tapi bukan admin, redirect ke halaman utama atau tampilkan pesan error
  if (!isAdmin) {
    return <Navigate to="/" replace />; // Atau tampilkan halaman "Akses Ditolak"
  }

  return children;
};

// Komponen untuk rute utama (non-admin)
const MainAppRoutes = () => {
  return (
    <div className="app-container min-h-screen flex flex-col">
      <Header />
      <main className="main-content flex-grow p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Product />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/login" element={<Login />} />

          {/* Rute yang dilindungi */}
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/cart" element={<PrivateRoute><CartPage /></PrivateRoute>} />
          <Route path="/checkout" element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
          <Route path="/transactions" element={<PrivateRoute><TransactionListPage /></PrivateRoute>} />

          {/* Rute Bersarang untuk Users */}
          <Route path="/users" element={<PrivateRoute><Outlet /></PrivateRoute>}>
            {/* <Route index element={<UserList />} />
            <Route path="list" element={<UserList />} />
            <Route path="add" element={<UserAdd />} /> */}
          </Route>

          {/* Rute Admin di dalam aplikasi utama (akses via /admin) */}
          <Route path="/admin/*" element={<AdminPrivateRoute><AdminLayout /></AdminPrivateRoute>}>
            <Route index element={<AdminDashboardPage />} />
            {/* <Route path="users" element={<AdminUsersPage />} />
            <Route path="products" element={<AdminProductsPage />} /> */}
            {/* Tambahkan rute admin lainnya di sini */}
            <Route path="*" element={<Navigate to="/admin" replace />} /> {/* Redirect jika path admin tidak valid */}
          </Route>

          {/* Rute default atau halaman 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

// Komponen untuk rute Admin ketika diakses via subdomain
const AdminAppRoutes = () => {
  return (
    <div className="admin-app-container min-h-screen flex flex-col">
      <AdminPrivateRoute>
        <AdminLayout>
          <Routes>
            <Route path="/" element={<AdminDashboardPage />} />
            <Route path="/users" element={<AdminUsersPage />} />
            <Route path="/products" element={<AdminProductsPage />} />
            {/* Tambahkan rute admin lainnya di sini untuk subdomain */}
            <Route path="*" element={<Navigate to="/" replace />} /> {/* Redirect jika path subdomain admin tidak valid */}
          </Routes>
        </AdminLayout>
      </AdminPrivateRoute>
    </div>
  );
};


function App() {
  // Mengecek apakah hostname saat ini adalah subdomain admin
  const isAdminSubdomain = window.location.hostname.startsWith('admin.');

  return (
    <Router>
      <AuthProvider>
        {isAdminSubdomain ? <AdminAppRoutes /> : <MainAppRoutes />}
      </AuthProvider>
    </Router>
  );
}

export default App;
