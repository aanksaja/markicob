import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminMenu from './AdminMenu';
import './AdminStyles.css';

const AdminLayout = () => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      <AdminMenu />

      <div className="admin-content">
        {/* Header */}
        <header
          style={{
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderBottom: '2px solid #e9ecef',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#212529',
                margin: '0',
              }}
            >
              Admin Panel
            </h1>
            <p
              style={{
                color: '#6c757d',
                margin: '5px 0 0 0',
              }}
            >
              Welcome back, {currentUser?.name || 'Admin'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => navigate('/')}
              className="btn btn-secondary btn-sm"
            >
              Go to Site
            </button>
            <button onClick={handleLogout} className="btn btn-danger btn-sm">
              Logout
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
