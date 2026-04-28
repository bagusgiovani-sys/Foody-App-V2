import type { ApiCartResponse } from '@/features/cart/types';

export const apiCartResponse: ApiCartResponse = {
  cart: [
    {
      restaurant: { id: 1, name: 'Warung Soto', logo: 'https://example.com/logo.jpg' },
      items: [
        {
          id: 10,
          menu: {
            id: 1,
            foodName: 'Soto Ayam',
            price: 25000,
            type: 'food',
            image: 'https://example.com/soto.jpg',
          },
          quantity: 2,
          itemTotal: 50000,
        },
      ],
      subtotal: 50000,
    },
  ],
  summary: { totalItems: 2, totalPrice: 50000, restaurantCount: 1 },
};
