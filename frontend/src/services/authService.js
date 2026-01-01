import axiosInstance from './api';

// Auth Services
export const authAPI = {
  register: (name, email, password) =>
    axiosInstance.post('/auth/register', { name, email, password }),

  login: (email, password) =>
    axiosInstance.post('/auth/login', { email, password }),

  logout: () =>
    axiosInstance.post('/auth/logout'),

  getProfile: () =>
    axiosInstance.get('/tasks/me'),
};

// Admin Services
export const adminAPI = {
  getAllUsers: () =>
    axiosInstance.get('/auth/admin/users'),
  
  updateUserRole: (userId, role) =>
    axiosInstance.put(`/auth/admin/users/${userId}/role`, { role }),
};

// Task Services
export const taskAPI = {
  getTasks: () =>
    axiosInstance.get('/tasks/get-tasks'),

  createTask: (title, description, status = 'pending') =>
    axiosInstance.post('/tasks/create-task', {
      title,
      description,
      status,
    }),

  updateTask: (id, title, description, status) =>
    axiosInstance.put(`/tasks/update-task/${id}`, {
      title,
      description,
      status,
    }),

  deleteTask: (id) =>
    axiosInstance.delete(`/tasks/delete-task/${id}`),
};
