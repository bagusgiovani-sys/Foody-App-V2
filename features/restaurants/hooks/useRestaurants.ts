import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { restaurantService } from '../services';
import type { RestaurantFilters } from '../types';

export function useRestaurantList(filters?: RestaurantFilters) {
  return useQuery({
    queryKey: ['restaurants', filters ?? {}],
    queryFn: () => restaurantService.getList(filters),
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  });
}
