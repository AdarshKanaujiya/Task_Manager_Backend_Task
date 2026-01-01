import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { taskAPI } from '../services/authService';
import AdminPanel from '../components/AdminPanel';
import Toast from '../components/Toast';
import '../styles/dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
  });

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await taskAPI.getTasks();
      setTasks(response.data.tasks || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.title || !formData.description) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        // Update task
        await taskAPI.updateTask(
          editingId,
          formData.title,
          formData.description,
          formData.status
        );
        setSuccess('✅ Task updated successfully!');
        setEditingId(null);
      } else {
        // Create new task
        await taskAPI.createTask(
          formData.title,
          formData.description,
          formData.status
        );
        setSuccess('✅ Task created successfully!');
      }
      setFormData({ title: '', description: '', status: 'pending' });
      setShowForm(false);
      await fetchTasks();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  const handleEditTask = (task) => {
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
    });
    setEditingId(task._id);
    setShowForm(true);
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await taskAPI.deleteTask(id);
      setSuccess('🗑️ Task deleted successfully!');
      await fetchTasks();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ title: '', description: '', status: 'pending' });
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'status-completed';
      case 'in progress':
        return 'status-in-progress';
      case 'pending':
      default:
        return 'status-pending';
    }
  };

  return (
    <div className="dashboard">
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
      
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Task Manager</h1>
          <div className="user-info">
            <div className="user-details">
              <span className="welcome-text">Welcome, <strong>{user?.name}</strong></span>
              {user?.role === 'admin' && (
                <span className="admin-badge">👑 Admin</span>
              )}
            </div>
            <div className="header-actions">
              <AdminPanel user={user} />
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-container">

          <div className="dashboard-actions">
            {!showForm && (
              <button
                className="btn-primary"
                onClick={() => setShowForm(true)}
              >
                + Add New Task
              </button>
            )}
          </div>

          {showForm && (
            <div className="task-form-container">
              <h2>{editingId ? 'Edit Task' : 'Create New Task'}</h2>
              <form onSubmit={handleAddTask} className="task-form">
                <div className="form-group">
                  <label htmlFor="title">Task Title *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter task title"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description *</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter task description"
                    rows="4"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    disabled={loading}
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In-Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : editingId ? 'Update Task' : 'Create Task'}
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="tasks-section">
            <h2>Your Tasks ({tasks.length})</h2>

            {loading && tasks.length === 0 && <p>Loading tasks...</p>}

            {!loading && tasks.length === 0 && !showForm && (
              <p className="empty-state">
                No tasks yet. Create your first task!
              </p>
            )}

            <div className="tasks-grid">
              {tasks.map((task) => (
                <div key={task._id} className="task-card">
                  <div className="task-header">
                    <h3>{task.title}</h3>
                    <span className={`task-status ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </div>

                  <p className="task-description">{task.description}</p>

                  <div className="task-actions">
                    <button
                      className="btn-edit"
                      onClick={() => handleEditTask(task)}
                      disabled={loading}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteTask(task._id)}
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
