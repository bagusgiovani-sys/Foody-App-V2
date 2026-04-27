import { apiClient } from '@/lib/apiClient';
import { API_ENDPOINTS } from '@/constants/api';
import type { LoginRequest, RegisterRequest, AuthResponse, ProfileResponse, User } from './types';

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<ProfileResponse>(API_ENDPOINTS.AUTH.GET_PROFILE);
    return response.data.data;
  },

  updateProfile: async (data: FormData): Promise<User> => {
    const response = await apiClient.put<ProfileResponse>(
      API_ENDPOINTS.AUTH.UPDATE_PROFILE,
      data,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data.data;
  },
};
