import type { LoginInput, RegisterInput, CreateAccountInput, CreateOrderInput } from '@shop-ban-nick/shared-schemas';
import type { AuthResponse, PaginationMeta } from '@shop-ban-nick/shared-schemas';
import type { IUser, IGame, IGameAccount, IOrder, IWalletTransaction, PaginatedResponse } from '@shop-ban-nick/shared-types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const API_BASE = API_URL.replace(/\/api\/?$/, '') || 'http://localhost:3001';

/** API lấy hình từ assets → return path (/assets/...) → client dùng getAssetUrl(path) để render từ API. */
export function getAssetUrl(path: string | null | undefined): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
}

export type ApiFieldError = { field: string; message: string };

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errors: ApiFieldError[] = []
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const errors: ApiFieldError[] = Array.isArray(body.errors) ? body.errors : [];
    const message = (body.message as string) || `Error ${res.status}`;
    const err = new ApiError(message, res.status, errors.length ? errors : [{ field: '_', message }]);
    (err as ApiError & { body?: unknown }).body = body;
    throw err;
  }

  return res.json();
}

export const api = {
  // Auth
  register: (data: Omit<RegisterInput, 'confirmPassword'>) =>
    fetcher<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  login: (data: LoginInput) =>
    fetcher<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),

  getProfile: () => fetcher<IUser>('/auth/profile'),
  updateProfile: (dto: { name?: string; phone?: string; avatar?: string }) =>
    fetcher<IUser>('/auth/profile', { method: 'PATCH', body: JSON.stringify(dto) }),

  // Wallet
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

  getBanners: () =>
    fetcher<{ image: string; title: string; subtitle: string; href: string; gradient: string; promo?: boolean }[]>('/banners'),

  getGames: () => fetcher<IGame[]>('/games'),
  getGameBySlug: (slug: string) => fetcher<IGame>(`/games/${slug}`),

  // Accounts
  getAccountsByGame: (slug: string, params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return fetcher<PaginatedResponse<IGameAccount>>(`/games/${slug}/accounts${query}`);
  },
  getAccountById: (id: string) => fetcher<IGameAccount>(`/accounts/${id}`),

  // Orders
  createOrder: (data: CreateOrderInput) =>
    fetcher<IOrder>('/orders', { method: 'POST', body: JSON.stringify(data) }),

  getMyOrders: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return fetcher<PaginatedResponse<IOrder>>(`/orders/my${query}`);
  },

  getOrderById: (id: string) => fetcher<IOrder>(`/orders/${id}`),

  uploadPaymentProof: (orderId: string, paymentProof: string) =>
    fetcher<IOrder>(`/orders/${orderId}/payment-proof`, { method: 'PUT', body: JSON.stringify({ paymentProof }) }),

  // Upload
  uploadFile: async (file: File) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    return res.json() as Promise<{ url: string }>;
  },

  // Admin
  admin: {
    getGames: () => fetcher<IGame[]>('/admin/games'),
    getGameById: (id: string) => fetcher<IGame>(`/admin/games/${id}`),
    createGame: (data: Record<string, unknown>) => fetcher<IGame>('/admin/games', { method: 'POST', body: JSON.stringify(data) }),
    updateGame: (id: string, data: Record<string, unknown>) => fetcher<IGame>(`/admin/games/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteGame: (id: string) => fetcher<IGame>(`/admin/games/${id}`, { method: 'DELETE' }),

    getAccountsByGame: (gameId: string, params?: Record<string, string>) => {
      const query = params ? '?' + new URLSearchParams(params).toString() : '';
      return fetcher<PaginatedResponse<IGameAccount>>(`/admin/accounts/game/${gameId}${query}`);
    },
    createAccount: (data: CreateAccountInput) => fetcher<IGameAccount>('/admin/accounts', { method: 'POST', body: JSON.stringify(data) }),
    updateAccount: (id: string, data: Record<string, unknown>) => fetcher<IGameAccount>(`/admin/accounts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteAccount: (id: string) => fetcher<IGameAccount>(`/admin/accounts/${id}`, { method: 'DELETE' }),
    createBulkAccounts: (accounts: CreateAccountInput[]) => fetcher<IGameAccount[]>('/admin/accounts/bulk', { method: 'POST', body: JSON.stringify({ accounts }) }),

    getOrders: (params?: Record<string, string>) => {
      const query = params ? '?' + new URLSearchParams(params).toString() : '';
      return fetcher<PaginatedResponse<IOrder>>(`/admin/orders${query}`);
    },
    getOrderById: (id: string) => fetcher<IOrder>(`/admin/orders/${id}`),
    updateOrderStatus: (id: string, status: string) =>
      fetcher<IOrder>(`/admin/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
    getStats: () => fetcher<Record<string, unknown>>('/admin/orders/stats'),
  },
};
