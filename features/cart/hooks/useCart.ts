import { useQuery } from '@tanstack/react-query';
import { cartService } from '../services';
import { useAuthStore } from '@/store/useAuthStore';

export const CART_QUERY_KEY = ['cart'] as const;

export function useCart() {
  const isLoggedIn = !!useAuthStore((s) => s.token);
  return useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: () => cartService.getCart(),
    staleTime: 30_000,
    enabled: isLoggedIn,
  });
}
