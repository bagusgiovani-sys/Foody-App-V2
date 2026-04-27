// Checkout request
export interface CheckoutItem {
  menuId: number;
  quantity: number;
}

export interface CheckoutRestaurant {
  restaurantId: number;
  items: CheckoutItem[];
}

export interface CheckoutPayload {
  restaurants: CheckoutRestaurant[];
  deliveryAddress: string;
  phone?: string;
  paymentMethod?: string;
  notes?: string;
}

// API response
export interface ApiTransactionPricing {
  subtotal: number;
  serviceFee: number;
  deliveryFee: number;
  totalPrice: number;
}

export interface ApiTransactionItem {
  menuId: number;
  menuName: string;
  price: number;
  quantity: number;
  itemTotal: number;
}

export interface ApiTransactionRestaurant {
  restaurant: { id: number; name: string; logo: string };
  items: ApiTransactionItem[];
  subtotal: number;
}

export interface ApiTransaction {
  id: number;
  transactionId: string;
  paymentMethod: string;
  status: 'done';
  deliveryAddress: string;
  phone: string;
  pricing: ApiTransactionPricing;
  restaurants: ApiTransactionRestaurant[];
  createdAt: string;
}

export interface ApiCheckoutResponse {
  transaction: ApiTransaction;
}

// View model stored for success page
export interface TransactionReceipt {
  transactionId: string;
  paymentMethod: string;
  createdAt: string;
  pricing: ApiTransactionPricing;
  totalItems: number;
}
