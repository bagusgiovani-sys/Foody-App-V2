import { apiClient } from '@/lib/apiClient';
import { API_ENDPOINTS } from '@/constants/api';
import { toRestaurant, toRestaurantDetail } from './mapper';
import type {
  ApiRestaurantListResponse,
  ApiRestaurantDetailResponse,
  RestaurantFilters,
  RestaurantListData,
  RestaurantDetail,
} from './types';

export const restaurantService = {
  getList: async (filters?: RestaurantFilters): Promise<RestaurantListData> => {
    const response = await apiClient.get<ApiRestaurantListResponse>(
      API_ENDPOINTS.RESTAURANTS.LIST,
      { params: filters }
    );
    const { restaurants, pagination } = response.data.data;
    return { restaurants: restaurants.map(toRestaurant), pagination };
  },

  getDetail: async (id: string): Promise<RestaurantDetail> => {
    const response = await apiClient.get<ApiRestaurantDetailResponse>(
      API_ENDPOINTS.RESTAURANTS.DETAIL(id)
    );
    return toRestaurantDetail(response.data.data);
  },
};
