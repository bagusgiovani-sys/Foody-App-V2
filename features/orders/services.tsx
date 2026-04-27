import { apiClient } from '@/lib/apiClient';
import { API_ENDPOINTS } from '@/constants/api';
import type { ApiOrdersResponse, OrderStatus, ReviewPayload } from './types';

export const ordersService = {
  async getMyOrders(status: OrderStatus): Promise<ApiOrdersResponse> {
    const res = await apiClient.get<{ data: ApiOrdersResponse }>(
      API_ENDPOINTS.ORDERS.MY_ORDERS,
      { params: { status, limit: 50 } }
    );
    return res.data.data;
  },

  async createReview(payload: ReviewPayload): Promise<void> {
    await apiClient.post(API_ENDPOINTS.REVIEWS.CREATE, {
      transactionId: payload.transactionId,
      restaurantId: payload.restaurantId,
      star: payload.star,
      comment: payload.comment,
    });
  },
};
