export const adminQueryKeys = {
  games: ['admin', 'games'] as const,
  gameById: (id: string) => ['admin', 'games', id] as const,
  accountsByGame: (gameId: string, params?: Record<string, string>) =>
    ['admin', 'accounts', gameId, params] as const,
  orders: (params?: Record<string, string>) => ['admin', 'orders', params] as const,
  orderById: (id: string) => ['admin', 'orders', id] as const,
  stats: ['admin', 'stats'] as const,
};
