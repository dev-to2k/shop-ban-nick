import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { queryKeys } from '@/lib/query-keys';

export function useAdminGame(id: string) {
  return useQuery({
    queryKey: queryKeys.admin.gameById(id),
    queryFn: () => api.admin.getGameById(id),
    enabled: !!id,
  });
}
