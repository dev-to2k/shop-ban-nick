import { useQuery } from '@tanstack/react-query';
import { api, queryKeys } from '../api';

interface UseAccountsParams {
  slug: string;
  page: number;
  sortBy: string;
  sortOrder: string;
  search: string;
  limit?: number;
}

export function useAccounts({ slug, page, sortBy, sortOrder, search, limit = 12 }: UseAccountsParams) {
  const params: Record<string, string> = {
    page: String(page),
    limit: String(limit),
    sortBy,
    sortOrder,
  };
  if (search) params.search = search;

  return useQuery({
    queryKey: queryKeys.accounts.byGame(slug, params),
    queryFn: () => api.getAccountsByGame(slug, params),
    enabled: !!slug,
  });
}
