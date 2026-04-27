import { apiClient } from '@/lib/apiClient';
import { API_ENDPOINTS } from '@/constants/api';
import type { ApiProfile, UpdateProfilePayload } from './types';

export const profileService = {
  async getProfile(): Promise<ApiProfile> {
    const res = await apiClient.get<{ data: ApiProfile }>(API_ENDPOINTS.AUTH.GET_PROFILE);
    return res.data.data;
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<ApiProfile> {
    const form = new FormData();
    if (payload.name) form.append('name', payload.name);
    if (payload.email) form.append('email', payload.email);
    if (payload.phone) form.append('phone', payload.phone);
    if (payload.avatar) form.append('avatar', payload.avatar);

    const res = await apiClient.put<{ data: ApiProfile }>(
      API_ENDPOINTS.AUTH.UPDATE_PROFILE,
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return res.data.data;
  },
};
