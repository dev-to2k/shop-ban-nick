import { useQuery } from '@tanstack/react-query';
import { api, queryKeys } from '../api';

export function useAdminGame(id: string) {
  return useQuery({
    queryKey: queryKeys.admin.gameById(id),
    queryFn: () => api.admin.getGameById(id),
    enabled: !!id,
  });
}
