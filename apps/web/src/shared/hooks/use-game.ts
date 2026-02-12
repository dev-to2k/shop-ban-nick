import { useQuery } from '@tanstack/react-query';
import { api, queryKeys } from '../api';

export function useGame(slug: string) {
  return useQuery({
    queryKey: queryKeys.games.bySlug(slug),
    queryFn: () => api.getGameBySlug(slug),
    enabled: !!slug,
  });
}
