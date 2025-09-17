// AI: API service using axios for HTTP requests to backend
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/signup', userData),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// Shops API calls
export const shopsAPI = {
  getNearbyShops: (params) => api.get('/shops', { params }),
  getShopById: (shopId) => api.get(`/shops/${shopId}`),
  createShop: (shopData) => api.post('/shops', shopData),
  updateShop: (shopId, updateData) => api.put(`/shops/${shopId}`, updateData),
  updateShopStatus: (shopId, status) => api.put(`/shops/${shopId}/status`, { isOpen: status }),
  updateShopMenu: (shopId, menu) => api.put(`/shops/${shopId}/menu`, { todayMenu: menu }),
  updateShopAnnouncement: (shopId, announcement) => api.put(`/shops/${shopId}/announcement`, { announcement })
};

// User API calls
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (userData) => api.put('/user/profile', userData),
  getFavorites: () => api.get('/user/favorites'),
  addToFavorites: (shopId) => api.post('/user/favorites', { shopId }),
  removeFromFavorites: (shopId) => api.delete(`/user/favorites/${shopId}`)
};

export default api;
