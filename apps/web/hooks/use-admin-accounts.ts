import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { queryKeys } from '@/lib/query-keys';

interface UseAdminAccountsParams {
  gameId: string;
  page: number;
  limit?: number;
}

export function useAdminAccounts({ gameId, page, limit = 20 }: UseAdminAccountsParams) {
  const params = { page: String(page), limit: String(limit) };

  return useQuery({
    queryKey: queryKeys.admin.accountsByGame(gameId, params),
    queryFn: () => api.admin.getAccountsByGame(gameId, params),
    enabled: !!gameId,
  });
}
