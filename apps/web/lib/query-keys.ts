export const queryKeys = {
  banners: { all: ['banners'] as const },
  games: {
    all: ['games'] as const,
    bySlug: (slug: string) => ['games', slug] as const,
  },
  accounts: {
    byGame: (slug: string, params?: Record<string, string>) => ['accounts', slug, params] as const,
    byId: (id: string) => ['accounts', id] as const,
  },
  orders: {
    my: (params?: Record<string, string>) => ['orders', 'my', params] as const,
    byId: (id: string) => ['orders', id] as const,
  },
  wallet: {
    all: ['wallet'] as const,
    transactions: (params?: { page?: number; limit?: number }) => ['wallet', 'transactions', params] as const,
  },
  admin: {
    games: ['admin', 'games'] as const,
    gameById: (id: string) => ['admin', 'games', id] as const,
    accountsByGame: (gameId: string, params?: Record<string, string>) =>
      ['admin', 'accounts', gameId, params] as const,
    orders: (params?: Record<string, string>) => ['admin', 'orders', params] as const,
    orderById: (id: string) => ['admin', 'orders', id] as const,
    stats: ['admin', 'stats'] as const,
  },
};
