// Raw API shape from GET /api/resto
export interface ApiRestaurant {
  id: number;
  name: string;
  star: number;
  place: string;
  logo: string;
  images: string[];
  category: string | null;
  reviewCount: number;
  menuCount: number;
  priceRange: { min: number; max: number };
  distance?: number; // only present with location-based queries
}

export interface ApiPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiRestaurantListFilters {
  range: number | null;
  priceMin: number | null;
  priceMax: number | null;
  rating: number | null;
  category: string | null;
}

export interface ApiRestaurantListResponse {
  success: boolean;
  message: string;
  data: {
    restaurants: ApiRestaurant[];
    pagination: ApiPagination;
    filters: ApiRestaurantListFilters;
  };
}

// Query params accepted by GET /api/resto
export interface RestaurantFilters {
  range?: number;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  category?: string;
  page?: number;
  limit?: number;
}

// View model — what the UI consumes (star renamed to rating)
export interface Restaurant {
  id: number;
  name: string;
  rating: number;
  place: string;
  logo: string;
  images: string[];
  category: string | null;
  reviewCount: number;
  menuCount: number;
  priceRange: { min: number; max: number };
  distance?: number;
}

export interface RestaurantListData {
  restaurants: Restaurant[];
  pagination: ApiPagination;
}

// --- Restaurant detail ---

export interface ApiMenuItemDetail {
  id: number;
  foodName: string;
  price: number;
  type: string;
  image: string;
}

export interface ApiReviewDetail {
  id: number;
  star: number;
  comment: string;
  createdAt: string;
  user: { id: number; name: string; avatar: string };
}

export interface ApiRestaurantDetail {
  id: number;
  name: string;
  star: number;
  averageRating: number;
  place: string;
  coordinates: { lat: number; long: number };
  distance?: number;
  logo: string;
  images: string[];
  category: string | null;
  totalMenus: number;
  totalReviews: number;
  menus: ApiMenuItemDetail[];
  reviews: ApiReviewDetail[];
}

export interface ApiRestaurantDetailResponse {
  success: boolean;
  message: string;
  data: ApiRestaurantDetail;
}

// View models for detail page
export interface MenuItemDetail {
  id: number;
  name: string;         // mapped from foodName
  price: number;
  type: 'food' | 'drink';
  image: string;
}

export interface ReviewDetail {
  id: number;
  rating: number;       // mapped from star
  comment: string;
  createdAt: string;
  user: { id: number; name: string; avatar: string };
}

export interface RestaurantDetail {
  id: number;
  name: string;
  rating: number;       // mapped from star
  place: string;
  logo: string;
  images: string[];
  category: string | null;
  totalMenus: number;
  totalReviews: number;
  distance?: number;
  menus: MenuItemDetail[];
  reviews: ReviewDetail[];
}
