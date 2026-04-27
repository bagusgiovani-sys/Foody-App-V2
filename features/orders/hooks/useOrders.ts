import { useMutation, useQuery } from '@tanstack/react-query';
import { ordersService } from '../services';
import type { OrderStatus, ReviewPayload } from '../types';

export function useMyOrders(status: OrderStatus) {
  return useQuery({
    queryKey: ['orders', status],
    queryFn: () => ordersService.getMyOrders(status),
    staleTime: 30_000,
  });
}

export function useCreateReview() {
  return useMutation({
    mutationFn: (payload: ReviewPayload) => ordersService.createReview(payload),
  });
}
