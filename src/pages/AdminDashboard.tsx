// pages/AdminDashboard.tsx
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin/overview', label: 'Overview', icon: '📊' },
    { path: '/admin/bookings', label: 'Bookings', icon: '📅' },
    { path: '/admin/users', label: 'User Management', icon: '👥' },
    { path: '/admin/menu', label: 'Menu Management', icon: '🍽️' },
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <div className="admin-logo">
          <h2>MaisonNoir</h2>
          <span>Administration Portal</span>
        </div>
        
        <nav className="admin-nav">
          {menuItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="admin-footer">
          <Link to="/" className="back-to-site">← Back to Site</Link>
        </div>
      </div>

      <div className="admin-main">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <p>Manage your dining empire.</p>
        </div>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;