import axios from 'axios';

// ─── API Base URL ─────────────────────────────────────────────────────────────
// In development: Vite proxy handles /api -> localhost:5000/api
// In production:  Uses VITE_API_URL environment variable
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? '/api' : 'https://your-backend-name.onrender.com/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor: Attach JWT Token ────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor: Handle Errors ─────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.status, error.response.data);

      // Auto logout on 401
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }

      const message =
        error.response.data?.message || 'An error occurred. Please try again.';
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // Network error - no response received
      console.error('Network Error:', error.request);
      return Promise.reject(
        new Error(
          'Network Error: Cannot connect to server. Please check your internet connection.'
        )
      );
    } else {
      console.error('Request Error:', error.message);
      return Promise.reject(new Error(error.message));
    }
  }
);

// ─── Auth API ─────────────────────────────────────────────────────────────────
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// ─── Complaints API ───────────────────────────────────────────────────────────
export const complaintsAPI = {
  create: (data) => api.post('/complaints', data),
  getAll: (params) => api.get('/complaints', { params }),
  getById: (id) => api.get(`/complaints/${id}`),
  update: (id, data) => api.put(`/complaints/${id}`, data),
  delete: (id) => api.delete(`/complaints/${id}`),
  searchByLocation: (location) =>
    api.get('/complaints/search', { params: { location } }),
};

// ─── AI API ───────────────────────────────────────────────────────────────────
export const aiAPI = {
  analyze: (data) => api.post('/ai/analyze', data),
};

export default api;
