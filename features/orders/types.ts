export type OrderStatus = 'preparing' | 'on_the_way' | 'delivered' | 'done' | 'cancelled';

export interface ApiOrderItem {
  menuId: number;
  menuName: string;
  price: number;
  image: string | null;
  quantity: number;
  itemTotal: number;
}

export interface ApiOrderRestaurant {
  restaurant: { id: number; name: string; logo: string };
  items: ApiOrderItem[];
  subtotal: number;
}

export interface ApiOrderPricing {
  subtotal: number;
  serviceFee: number;
  deliveryFee: number;
  totalPrice: number;
}

export interface ApiOrder {
  id: number;
  transactionId: string;
  status: OrderStatus;
  paymentMethod: string;
  deliveryAddress: string;
  phone: string;
  pricing: ApiOrderPricing;
  restaurants: ApiOrderRestaurant[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiOrdersResponse {
  orders: ApiOrder[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ReviewPayload {
  transactionId: string;
  restaurantId: number;
  star: number;
  comment?: string;
}

export interface OrdersFilters {
  status: OrderStatus;
}
