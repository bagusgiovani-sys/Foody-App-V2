import type {
  ApiRestaurant,
  Restaurant,
  ApiMenuItemDetail,
  MenuItemDetail,
  ApiReviewDetail,
  ReviewDetail,
  ApiRestaurantDetail,
  RestaurantDetail,
} from './types';

export function toRestaurant(api: ApiRestaurant): Restaurant {
  const { star, ...rest } = api;
  return { ...rest, rating: star };
}

export function toMenuItemDetail(api: ApiMenuItemDetail): MenuItemDetail {
  return {
    id: api.id,
    name: api.foodName,
    price: api.price,
    type: api.type === 'drink' ? 'drink' : 'food',
    image: api.image,
  };
}

export function toReviewDetail(api: ApiReviewDetail): ReviewDetail {
  const { star, ...rest } = api;
  return { ...rest, rating: star };
}

export function toRestaurantDetail(api: ApiRestaurantDetail): RestaurantDetail {
  const { star, menus, reviews, averageRating: _avg, coordinates: _coords, ...rest } = api;
  return {
    ...rest,
    rating: star,
    menus: menus.map(toMenuItemDetail),
    reviews: reviews.map(toReviewDetail),
  };
}
