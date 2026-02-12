import type { IWalletTransaction, PaginatedResponse } from '@shop-ban-nick/shared-types';
import { fetcher } from '../core';

export const walletApi = {
  getWallet: () => fetcher<{ balance: number; transactions: IWalletTransaction[] }>('/wallet'),
  getWalletTransactions: (params?: { page?: number; limit?: number }) => {
    const search = new URLSearchParams();
    if (params?.page != null) search.set('page', String(params.page));
    if (params?.limit != null) search.set('limit', String(params.limit));
    const query = search.toString() ? '?' + search.toString() : '';
    return fetcher<PaginatedResponse<IWalletTransaction>>(`/wallet/transactions${query}`);
  },
  createDepositRequest: (body: { amount: number; provider?: string }, returnUrl?: string, cancelUrl?: string) => {
    const params = new URLSearchParams();
    if (returnUrl) params.set('returnUrl', returnUrl);
    if (cancelUrl) params.set('cancelUrl', cancelUrl);
    const query = params.toString() ? '?' + params.toString() : '';
    return fetcher<{ requestId: string; amount: number; provider: string; status: string; paymentUrl: string | null; createdAt: string }>(
      `/wallet/deposit${query}`,
      { method: 'POST', body: JSON.stringify(body) }
    );
  },
  getDepositRequest: (id: string) =>
    fetcher<{ id: string; amount: number; provider: string; status: string; paymentUrl: string | null; createdAt: string; completedAt: string | null }>(
      `/wallet/deposit/${id}`
    ),
  confirmDepositRequest: (id: string) =>
    fetcher<{ balance: number; transaction: IWalletTransaction }>(`/wallet/deposit/${id}/confirm`, { method: 'POST' }),
};
