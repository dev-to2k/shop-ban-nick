import type { CreateAccountInput, CreateGameInput, UpdateGameInput, UpdateAccountInput } from '@shop-ban-nick/shared-schemas';
import type {
  IGame,
  IGameAccount,
  IOrder,
  IAdminStats,
  PaginatedResponse,
  OrderStatus,
} from '@shop-ban-nick/shared-types';
import { fetcher } from '../core';

export const adminApi = {
  getGames: () => fetcher<IGame[]>('/admin/games'),
  getGameById: (id: string) => fetcher<IGame>(`/admin/games/${id}`),
  createGame: (data: CreateGameInput) => fetcher<IGame>('/admin/games', { method: 'POST', body: JSON.stringify(data) }),
  updateGame: (id: string, data: UpdateGameInput) => fetcher<IGame>(`/admin/games/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteGame: (id: string) => fetcher<IGame>(`/admin/games/${id}`, { method: 'DELETE' }),

  getAccountsByGame: (gameId: string, params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return fetcher<PaginatedResponse<IGameAccount>>(`/admin/accounts/game/${gameId}${query}`);
  },
  createAccount: (data: CreateAccountInput) => fetcher<IGameAccount>('/admin/accounts', { method: 'POST', body: JSON.stringify(data) }),
  updateAccount: (id: string, data: UpdateAccountInput) => fetcher<IGameAccount>(`/admin/accounts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteAccount: (id: string) => fetcher<IGameAccount>(`/admin/accounts/${id}`, { method: 'DELETE' }),
  createBulkAccounts: (accounts: CreateAccountInput[]) => fetcher<IGameAccount[]>('/admin/accounts/bulk', { method: 'POST', body: JSON.stringify({ accounts }) }),

  getOrders: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return fetcher<PaginatedResponse<IOrder>>(`/admin/orders${query}`);
  },
  getOrderById: (id: string) => fetcher<IOrder>(`/admin/orders/${id}`),
  updateOrderStatus: (id: string, status: OrderStatus) =>
    fetcher<IOrder>(`/admin/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  getStats: () => fetcher<IAdminStats>('/admin/orders/stats'),
};
