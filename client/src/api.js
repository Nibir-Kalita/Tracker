import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses (token expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth
export const register = (name, password) =>
  api.post('/auth/register', { name, password });

export const login = (name, password) =>
  api.post('/auth/login', { name, password });

export const googleLogin = (credential) =>
  api.post('/auth/google', { credential });

// Tasks
export const getTasks = (params) =>
  api.get('/tasks', { params });

export const createTask = (task) =>
  api.post('/tasks', task);

export const updateTask = (id, updates) =>
  api.put(`/tasks/${id}`, updates);

export const deleteTask = (id) =>
  api.delete(`/tasks/${id}`);

export const getProgress = (params) =>
  api.get('/tasks/progress/stats', { params });

export default api;
