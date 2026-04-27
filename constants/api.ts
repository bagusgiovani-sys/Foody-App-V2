// 📄 FILE: constants/api.ts

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    GET_PROFILE: "/api/auth/profile",
    UPDATE_PROFILE: "/api/auth/profile",
  },

  // Cart
  CART: {
    GET: "/api/cart",
    ADD: "/api/cart",
    CLEAR: "/api/cart",
    UPDATE_ITEM: (id: string) => `/api/cart/${id}`,
    REMOVE_ITEM: (id: string) => `/api/cart/${id}`,
  },

  // Orders
  ORDERS: {
    CHECKOUT: "/api/order/checkout",
    MY_ORDERS: "/api/order/my-order",
  },

  // Restaurants
  RESTAURANTS: {
    LIST: "/api/resto",
    NEARBY: "/api/resto/nearby",
    RECOMMENDED: "/api/resto/recommended",
    BEST_SELLER: "/api/resto/best-seller",
    SEARCH: "/api/resto/search",
    DETAIL: (id: string) => `/api/resto/${id}`,
  },

  // Reviews
  REVIEWS: {
    CREATE: "/api/review",
    MY_REVIEWS: "/api/review/my-reviews",
    BY_RESTAURANT: (restaurantId: string) =>
      `/api/review/restaurant/${restaurantId}`,
  },
};
