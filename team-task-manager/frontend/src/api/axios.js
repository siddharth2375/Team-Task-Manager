import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT on every request
api.interceptors.request.use((config) => {
  // Dynamically import to avoid circular deps — read from localStorage directly
  const raw = localStorage.getItem('auth-storage');
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      const token = parsed?.state?.token;
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch {
      // ignore parse errors
    }
  }
  return config;
});

// Handle 401 globally and surface error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message || error.message || 'Something went wrong';

    if (status === 401) {
      localStorage.removeItem('auth-storage');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;
