import type { ApiRestaurant, Restaurant } from './types';

export function toRestaurant(api: ApiRestaurant): Restaurant {
  const { star, ...rest } = api;
  return { ...rest, rating: star };
}
