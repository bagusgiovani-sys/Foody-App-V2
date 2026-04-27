import axios from 'axios';
import { API_BASE_URL } from '@/constants/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Lazy store access — avoids circular-dep at module init while keeping ESM imports
function getAuthStore() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return (require('@/store/useAuthStore') as typeof import('@/store/useAuthStore')).useAuthStore;
}

apiClient.interceptors.request.use((config) => {
  const token = getAuthStore().getState().token;
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
        getAuthStore().getState().clearAuth();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
