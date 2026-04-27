// API response types
export interface ApiCartMenu {
  id: number;
  foodName: string;
  price: number;
  type: string;
  image: string;
}

export interface ApiCartItem {
  id: number;
  menu: ApiCartMenu;
  quantity: number;
  itemTotal: number;
}

export interface ApiCartRestaurant {
  id: number;
  name: string;
  logo: string;
}

export interface ApiCartGroup {
  restaurant: ApiCartRestaurant;
  items: ApiCartItem[];
  subtotal: number;
}

export interface ApiCartSummary {
  totalItems: number;
  totalPrice: number;
  restaurantCount: number;
}

export interface ApiCartResponse {
  cart: ApiCartGroup[];
  summary: ApiCartSummary;
}

// View models
export interface CartMenuItem {
  id: number;
  name: string;
  price: number;
  type: string;
  image: string;
}

export interface CartItem {
  id: number;
  menu: CartMenuItem;
  quantity: number;
  itemTotal: number;
}

export interface CartRestaurant {
  id: number;
  name: string;
  logo: string;
}

export interface CartGroup {
  restaurant: CartRestaurant;
  items: CartItem[];
  subtotal: number;
}

export interface CartSummary {
  totalItems: number;
  totalPrice: number;
  restaurantCount: number;
}

export interface Cart {
  groups: CartGroup[];
  summary: CartSummary;
}

// Mutation payloads
export interface AddToCartPayload {
  restaurantId: number;
  menuId: number;
  quantity: number;
}

export interface UpdateCartItemPayload {
  id: number;
  quantity: number;
}
