import type {
  ApiRestaurant,
  ApiRestaurantDetail,
  ApiMenuItemDetail,
  ApiReviewDetail,
} from '@/features/restaurants/types';

export const apiRestaurant: ApiRestaurant = {
  id: 1,
  name: 'Warung Soto',
  star: 4.5,
  place: 'Jakarta Selatan',
  logo: 'https://example.com/logo.jpg',
  images: ['https://example.com/img.jpg'],
  category: 'Indonesian',
  reviewCount: 12,
  menuCount: 8,
  priceRange: { min: 15000, max: 50000 },
};

export const apiMenuItem: ApiMenuItemDetail = {
  id: 1,
  foodName: 'Soto Ayam',
  price: 25000,
  type: 'food',
  image: 'https://example.com/soto.jpg',
};

export const apiReview: ApiReviewDetail = {
  id: 1,
  star: 5,
  comment: 'Sangat enak!',
  createdAt: '2024-01-15T10:00:00Z',
  user: { id: 1, name: 'Alice', avatar: 'https://example.com/avatar.jpg' },
};

export const apiRestaurantDetail: ApiRestaurantDetail = {
  id: 1,
  name: 'Warung Soto',
  star: 4.5,
  averageRating: 4.3,
  place: 'Jakarta Selatan',
  coordinates: { lat: -6.2, long: 106.8 },
  logo: 'https://example.com/logo.jpg',
  images: ['https://example.com/img.jpg'],
  category: 'Indonesian',
  totalMenus: 8,
  totalReviews: 12,
  menus: [apiMenuItem],
  reviews: [apiReview],
};
