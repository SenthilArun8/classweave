import axios from 'axios';

const baseURL = process.env.NODE_ENV === 'production'
  ? 'https://daycare-ai-activity-suggestions-backend.onrender.com'
  : 'http://localhost:3004';

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
