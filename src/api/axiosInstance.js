import axios from 'axios';

/**
 * Centralized Axios instance for all API requests.
 * - Automatically attaches JWT token from localStorage.
 * - Handles 401 responses by clearing auth state and redirecting.
 */
const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor ─────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('samadhan_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized — token expired or invalid
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('samadhan_token');
      localStorage.removeItem('samadhan_user');
      localStorage.removeItem('samadhan_role');

      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
