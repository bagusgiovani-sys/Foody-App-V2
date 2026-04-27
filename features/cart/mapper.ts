import type { ApiCartGroup, ApiCartItem, ApiCartResponse, Cart, CartGroup, CartItem } from './types';

function toCartItem(api: ApiCartItem): CartItem {
  return {
    id: api.id,
    menu: {
      id: api.menu.id,
      name: api.menu.foodName,
      price: api.menu.price,
      type: api.menu.type,
      image: api.menu.image,
    },
    quantity: api.quantity,
    itemTotal: api.itemTotal,
  };
}

function toCartGroup(api: ApiCartGroup): CartGroup {
  return {
    restaurant: api.restaurant,
    items: api.items.map(toCartItem),
    subtotal: api.subtotal,
  };
}

export function toCart(api: ApiCartResponse): Cart {
  return {
    groups: api.cart.map(toCartGroup),
    summary: api.summary,
  };
}
