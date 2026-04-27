import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { profileService } from '../services';
import type { UpdateProfilePayload } from '../types';
import { useAuthStore } from '@/store/useAuthStore';

export const PROFILE_QUERY_KEY = ['profile'] as const;

export function useProfile() {
  const isLoggedIn = !!useAuthStore((s) => s.token);
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: () => profileService.getProfile(),
    staleTime: 60_000,
    enabled: isLoggedIn,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((s) => s.setAuth);
  const token = useAuthStore((s) => s.token);

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => profileService.updateProfile(payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(PROFILE_QUERY_KEY, updated);
      // Keep auth store user in sync
      if (token) {
        setAuth(
          {
            id: updated.id,
            name: updated.name,
            email: updated.email,
            phone: updated.phone ?? '',
            avatar: updated.avatar ?? '',
            latitude: updated.latitude ?? 0,
            longitude: updated.longitude ?? 0,
            createdAt: updated.createdAt,
          },
          token
        );
      }
    },
  });
}
