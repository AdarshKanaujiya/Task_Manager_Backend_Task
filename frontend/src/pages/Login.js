import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import '../styles/auth.css';

const Login = () => {
    // console.log('Rendering Login component');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      console.log('Attempting login...');
      await login(formData.email, formData.password);
      console.log('Login successful!');
      setFormData({ email: '', password: '' });
      setSuccess('✅ Login successful! Redirecting...');
      // Increased timeout so you can see the toast before redirect
      setTimeout(() => navigate('/dashboard', { replace: true }), 2000);
    } catch (err) {
      console.error('Login error caught:', err);
      const message = err.response?.data?.message || err.message || 'Login failed';
      console.log('Error message to display:', message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Toast message={success} type="success" onClose={() => {}} />
      <Toast message={error} type="error" onClose={() => setError('')} />
      <div className="auth-card">
        <h1>Login</h1>
        <p className="auth-subtitle">Access your task manager</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-link">
          Don't have an account? <Link to="/register" onClick={()=>console.log("going to regiter")}>Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
