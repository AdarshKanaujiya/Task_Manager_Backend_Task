import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/authService';
import Toast from './Toast';
import '../styles/admin.css';

const AdminPanel = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPanel, setShowPanel] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState(null);

  const fetchAllUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await adminAPI.getAllUsers();
      setUsers(response.data.users || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingUserId(userId);
    setError('');
    setSuccess('');
    try {
      await adminAPI.updateUserRole(userId, newRole);
      // Update local state
      setUsers(users.map(u => 
        u._id === userId ? { ...u, role: newRole } : u
      ));
      setSuccess(`✅ User role updated to ${newRole} successfully!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user role');
    } finally {
      setUpdatingUserId(null);
    }
  };

  useEffect(() => {
    if (showPanel) {
      fetchAllUsers();
    }
  }, [showPanel]);

  if (user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="admin-panel-container">
      <Toast 
        message={success} 
        type="success" 
        onClose={() => setSuccess('')}
      />
      <Toast 
        message={error} 
        type="error" 
        onClose={() => setError('')}
      />
      
      <button 
        className="admin-toggle-btn"
        onClick={() => setShowPanel(!showPanel)}
        title="Admin Panel"
      >
        👤 Admin Panel
      </button>

      {showPanel && (
        <div className="admin-panel-modal">
          <div className="admin-panel">
            <div className="admin-header">
              <h2>Admin Panel - Users Management</h2>
              <button 
                className="close-btn"
                onClick={() => setShowPanel(false)}
              >
                ✕
              </button>
            </div>

            {loading && <p>Loading users...</p>}

            {!loading && users.length === 0 && <p>No users found.</p>}

            <div className="users-table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className={u.role === 'admin' ? 'admin-row' : ''}>
                      <td><strong>{u.name}</strong></td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`role-badge role-${u.role}`}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        {updatingUserId === u._id ? (
                          <span className="updating-text">Updating...</span>
                        ) : (
                          <select 
                            value={u.role}
                            onChange={(e) => handleRoleChange(u._id, e.target.value)}
                            className="role-select"
                            disabled={u._id === user?._id}
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="admin-stats">
              <p>Total Users: <strong>{users.length}</strong></p>
              <p>Admins: <strong>{users.filter(u => u.role === 'admin').length}</strong></p>
              <p>Regular Users: <strong>{users.filter(u => u.role === 'user').length}</strong></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
