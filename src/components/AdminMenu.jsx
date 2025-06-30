import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminMenu = () => {
  const location = useLocation();

  const menuItems = [
    {
      path: '/admin',
      name: 'Dashboard',
      icon: '📊',
    },
    {
      path: '/admin/users',
      name: 'Users',
      icon: '👥',
    },
    {
      path: '/admin/items',
      name: 'Items',
      icon: '📦',
    },
    {
      path: '/admin/invoices',
      name: 'Invoices',
      icon: '📄',
    },
    {
      path: '/admin/roles',
      name: 'Roles',
      icon: '🔐',
    },
  ];

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="admin-menu">
      <ul className="menu-list">
        {menuItems.map((item) => (
          <li key={item.path} className="menu-item">
            <Link
              to={item.path}
              className={`menu-link ${isActive(item.path) ? 'active' : ''}`}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-text">{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default AdminMenu;
