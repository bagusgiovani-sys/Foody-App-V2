import { useMutation } from '@tanstack/react-query';
import { cartService, type AddToCartPayload } from '../services';

export function useAddToCart() {
  return useMutation({
    mutationFn: (payload: AddToCartPayload) => cartService.addItem(payload),
  });
}
