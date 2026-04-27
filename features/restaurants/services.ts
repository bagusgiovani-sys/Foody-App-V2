import { apiClient } from '@/lib/apiClient';
import { API_ENDPOINTS } from '@/constants/api';
import { toRestaurant } from './mapper';
import type { ApiRestaurantListResponse, RestaurantFilters, RestaurantListData } from './types';

export const restaurantService = {
  getList: async (filters?: RestaurantFilters): Promise<RestaurantListData> => {
    const response = await apiClient.get<ApiRestaurantListResponse>(
      API_ENDPOINTS.RESTAURANTS.LIST,
      { params: filters }
    );
    const { restaurants, pagination } = response.data.data;
    return { restaurants: restaurants.map(toRestaurant), pagination };
  },
};
