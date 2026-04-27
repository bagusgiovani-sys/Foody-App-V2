import axios from 'axios';
import { API_BASE_URL } from '@/constants/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  // Import lazily to avoid circular dependency at module init time
  const { useAuthStore } = require('@/store/useAuthStore');
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const protectedRoutes = ['/profile', '/cart', '/checkout', '/orders'];
      if (protectedRoutes.some((r) => window.location.pathname.startsWith(r))) {
        const { useAuthStore } = require('@/store/useAuthStore');
        useAuthStore.getState().clearAuth();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
