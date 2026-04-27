import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { checkoutService } from '../services';
import type { CheckoutPayload } from '../types';
import { useCheckoutStore } from '@/store/useCheckoutStore';
import { CART_QUERY_KEY } from '@/features/cart/hooks/useCart';

export function useCheckout() {
  const queryClient = useQueryClient();
  const setReceipt = useCheckoutStore((s) => s.setReceipt);
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: CheckoutPayload) => checkoutService.checkout(payload),
    onSuccess: (data) => {
      const { transaction } = data;
      const totalItems = transaction.restaurants.reduce(
        (sum, r) => sum + r.items.reduce((s, i) => s + i.quantity, 0),
        0
      );
      setReceipt({
        transactionId: transaction.transactionId,
        paymentMethod: transaction.paymentMethod,
        createdAt: transaction.createdAt,
        pricing: transaction.pricing,
        totalItems,
      });
      queryClient.removeQueries({ queryKey: CART_QUERY_KEY });
      router.push('/checkout/success');
    },
  });
}
