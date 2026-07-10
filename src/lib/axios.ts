import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach token if it exists in localStorage
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Extract error messages cleanly
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An unexpected error occurred';
    
    if (error.response) {
      // The server responded with a status code outside the 2xx range
      const data = error.response.data;
      if (data && data.message) {
        if (Array.isArray(data.message)) {
          message = data.message.join(', '); // Join NestJS validation messages
        } else {
          message = data.message;
        }
      } else {
        message = error.response.statusText || message;
      }

      // Handle 401 Unauthorized globally (exclude login path to avoid redirect loops)
      if (error.response.status === 401 && typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } else if (error.request) {
      // Request was made but no response was received
      message = 'Unable to connect to the server. Please check if the backend is running.';
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
