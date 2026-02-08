import type { IGameAccount, PaginatedResponse } from '@shop-ban-nick/shared-types';
import { fetcher } from '../core';

export const accountApi = {
  getAccountsByGame: (slug: string, params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return fetcher<PaginatedResponse<IGameAccount>>(`/games/${slug}/accounts${query}`);
  },
  getAccountById: (id: string) => fetcher<IGameAccount>(`/accounts/${id}`),
};
