export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'https://be-restaurant-production.up.railway.app';

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    GET_PROFILE: '/api/auth/profile',
    UPDATE_PROFILE: '/api/auth/profile',
  },
  CART: {
    GET: '/api/cart',
    ADD: '/api/cart',
    CLEAR: '/api/cart',
    UPDATE_ITEM: (id: string) => `/api/cart/${id}`,
    REMOVE_ITEM: (id: string) => `/api/cart/${id}`,
  },
  ORDERS: {
    CHECKOUT: '/api/order/checkout',
    MY_ORDERS: '/api/order/my-order',
  },
  RESTAURANTS: {
    LIST: '/api/resto',
    NEARBY: '/api/resto/nearby',
    DETAIL: (id: string) => `/api/resto/${id}`,
  },
  REVIEWS: {
    CREATE: '/api/review',
    MY_REVIEWS: '/api/review/my-reviews',
    BY_RESTAURANT: (restaurantId: string) => `/api/review/restaurant/${restaurantId}`,
  },
};
