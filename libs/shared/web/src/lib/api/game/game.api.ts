import type { IGame } from '@shop-ban-nick/shared-types';
import { fetcher } from '../core';

export const gameApi = {
  getGames: () => fetcher<IGame[]>('/games'),
  getGameBySlug: (slug: string) => fetcher<IGame>(`/games/${slug}`),
};
