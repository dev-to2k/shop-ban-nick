export const walletQueryKeys = {
  all: ['wallet'] as const,
  transactions: (params?: { page?: number; limit?: number }) => ['wallet', 'transactions', params] as const,
};
