'use client';

import { useQuery } from '@tanstack/react-query';
import { api, queryKeys } from '@shop-ban-nick/shared-web';
import type { GameWithCount } from '../types';

export function useGamesQuery() {
  return useQuery({
    queryKey: queryKeys.games.all,
    queryFn: () => api.getGames(),
    staleTime: 60_000,
  });
}
