import { describe, it, expect } from 'vitest';
import { toCart } from './mapper';
import { apiCartResponse } from '@/test/fixtures/cart.fixture';
import type { ApiCartResponse } from './types';

describe('toCart', () => {
  it('maps foodName to name on nested menu items', () => {
    const result = toCart(apiCartResponse);
    expect(result.groups[0].items[0].menu.name).toBe('Soto Ayam');
    expect(result.groups[0].items[0].menu).not.toHaveProperty('foodName');
  });

  it('preserves quantity and itemTotal', () => {
    const result = toCart(apiCartResponse);
    expect(result.groups[0].items[0].quantity).toBe(2);
    expect(result.groups[0].items[0].itemTotal).toBe(50000);
  });

  it('preserves subtotal per group', () => {
    expect(toCart(apiCartResponse).groups[0].subtotal).toBe(50000);
  });

  it('passes summary through unchanged', () => {
    expect(toCart(apiCartResponse).summary).toEqual({
      totalItems: 2,
      totalPrice: 50000,
      restaurantCount: 1,
    });
  });

  it('returns empty groups array for empty cart', () => {
    const empty: ApiCartResponse = {
      cart: [],
      summary: { totalItems: 0, totalPrice: 0, restaurantCount: 0 },
    };
    expect(toCart(empty).groups).toHaveLength(0);
  });

  it('handles multiple groups', () => {
    const twoGroups: ApiCartResponse = {
      ...apiCartResponse,
      cart: [
        apiCartResponse.cart[0],
        {
          ...apiCartResponse.cart[0],
          restaurant: { id: 2, name: 'Bakso Pak Eko', logo: '' },
        },
      ],
    };
    const result = toCart(twoGroups);
    expect(result.groups).toHaveLength(2);
    expect(result.groups[1].restaurant.name).toBe('Bakso Pak Eko');
  });
});
