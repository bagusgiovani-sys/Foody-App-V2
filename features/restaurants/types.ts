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

// For restaurant detail page (will be expanded in that phase)
export interface MenuItem {
  id: number;
  food_name: string;
  price: number;
  type: string;
  image: string;
}

export interface Review {
  id: number;
  star: number;
  comment: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    avatar: string;
  };
}
