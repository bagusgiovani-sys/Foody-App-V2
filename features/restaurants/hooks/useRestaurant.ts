import { useQuery } from '@tanstack/react-query';
import { restaurantService } from '../services';

export function useRestaurantDetail(id: string) {
  return useQuery({
    queryKey: ['restaurant', id],
    queryFn: () => restaurantService.getDetail(id),
    staleTime: 60_000,
    enabled: !!id,
  });
}
