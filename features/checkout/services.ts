import { apiClient } from '@/lib/apiClient';
import { API_ENDPOINTS } from '@/constants/api';
import type { ApiCheckoutResponse, CheckoutPayload } from './types';

export const checkoutService = {
  async checkout(payload: CheckoutPayload): Promise<ApiCheckoutResponse> {
    const res = await apiClient.post<{ data: ApiCheckoutResponse }>(
      API_ENDPOINTS.ORDERS.CHECKOUT,
      payload
    );
    return res.data.data;
  },
};
