import { apiClient } from '@/lib/apiClient';
import { API_ENDPOINTS } from '@/constants/api';

export interface AddToCartPayload {
  restaurantId: number;
  menuId: number;
  quantity: number;
}

export const cartService = {
  addItem: async (payload: AddToCartPayload) => {
    const response = await apiClient.post(API_ENDPOINTS.CART.ADD, payload);
    return response.data;
  },
};
