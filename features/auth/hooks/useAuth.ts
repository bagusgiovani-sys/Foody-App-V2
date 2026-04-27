import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';
import { authService } from '../services';
import type { LoginRequest, RegisterRequest } from '../types';

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  return {
    user,
    token,
    isAuthenticated: !!token,
    logout: clearAuth,
  };
}

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (res) => {
      setAuth(res.data.user, res.data.token);
      router.push('/');
    },
    onError: () => toast.error('Invalid email or password'),
  });
}

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (res) => {
      setAuth(res.data.user, res.data.token);
      router.push('/');
    },
    onError: () => toast.error('Registration failed. Please try again.'),
  });
}
