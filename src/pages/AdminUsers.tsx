// pages/AdminUsers.tsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import './AdminUsers.css';

const AdminUsers: React.FC = () => {
  const { users, deleteUser, user: currentUser } = useAuth();

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(id);
    }
  };

  return (
    <div className="admin-users">
      <div className="users-header">
        <h2>User Management</h2>
        <p>Total Registered Users: {users.length}</p>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>
                  <div className="user-name-cell">
                    <strong>{u.name}</strong>
                    {u.id === currentUser?.id && <span className="self-badge">(You)</span>}
                  </div>
                </td>
                <td>{u.email}</td>
                <td>{u.phone}</td>
                <td>
                  <span className={`role-badge ${u.role}`}>
                    {u.role}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="action-btn delete"
                      onClick={() => handleDelete(u.id)}
                      disabled={u.id === currentUser?.id}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="no-users">
            <p>No users found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
