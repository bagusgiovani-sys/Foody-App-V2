import { apiClient } from '@/lib/apiClient';
import { API_ENDPOINTS } from '@/constants/api';
import { toCart } from './mapper';
import type { AddToCartPayload, ApiCartResponse, Cart, UpdateCartItemPayload } from './types';

export const cartService = {
  async getCart(): Promise<Cart> {
    const res = await apiClient.get<{ data: ApiCartResponse }>(API_ENDPOINTS.CART.GET);
    return toCart(res.data.data);
  },

  async addItem(payload: AddToCartPayload): Promise<void> {
    await apiClient.post(API_ENDPOINTS.CART.ADD, payload);
  },

  async updateItem({ id, quantity }: UpdateCartItemPayload): Promise<void> {
    await apiClient.put(API_ENDPOINTS.CART.UPDATE_ITEM(String(id)), { quantity });
  },

  async removeItem(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.CART.REMOVE_ITEM(String(id)));
  },

  async clearCart(): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.CART.CLEAR);
  },
};
