import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { cartService } from '../services';
import type { AddToCartPayload, UpdateCartItemPayload } from '../types';
import { CART_QUERY_KEY } from './useCart';

export function useAddToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddToCartPayload) => cartService.addItem(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      toast.success('Added to cart');
    },
    onError: () => toast.error('Failed to add to cart'),
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateCartItemPayload) => cartService.updateItem(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY }),
    onError: () => toast.error('Failed to update cart'),
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => cartService.removeItem(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY }),
    onError: () => toast.error('Failed to remove item'),
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => cartService.clearCart(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY }),
    onError: () => toast.error('Failed to clear cart'),
  });
}
