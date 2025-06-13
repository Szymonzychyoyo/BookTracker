// client/src/api/axiosConfig.js
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001/api';
const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
