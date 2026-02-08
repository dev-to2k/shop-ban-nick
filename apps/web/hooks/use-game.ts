import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { queryKeys } from '@/lib/query-keys';

export function useGame(slug: string) {
  return useQuery({
    queryKey: queryKeys.games.bySlug(slug),
    queryFn: () => api.getGameBySlug(slug),
    enabled: !!slug,
  });
}
