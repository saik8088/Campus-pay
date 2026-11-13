import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Attach JWT token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('campuspay_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('campuspay_token');
      localStorage.removeItem('campuspay_user');
    }
    return Promise.reject(error);
  }
);

export default api;

// Stall APIs
export const getStalls = () => api.get('/stalls');
export const getStall = (id) => api.get(`/stalls/${id}`);

// Auth APIs
export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (data) => api.post('/auth/register', data);

// Owner APIs
export const getOwnerStalls = () => api.get('/owner/stalls');
export const createStall = (data) => api.post('/owner/stalls', data);
export const updateStall = (id, data) => api.put(`/owner/stalls/${id}`, data);
export const deleteStall = (id) => api.delete(`/owner/stalls/${id}`);
export const uploadQR = (id, formData) =>
  api.put(`/owner/stalls/${id}/qr`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
