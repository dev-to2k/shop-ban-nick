import type { CreateOrderInput } from '@shop-ban-nick/shared-schemas';
import type { IOrder, PaginatedResponse } from '@shop-ban-nick/shared-types';
import { fetcher } from '../core';

export const orderApi = {
  createOrder: (data: CreateOrderInput) =>
    fetcher<IOrder>('/orders', { method: 'POST', body: JSON.stringify(data) }),
  getMyOrders: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return fetcher<PaginatedResponse<IOrder>>(`/orders/my${query}`);
  },
  getOrderById: (id: string) => fetcher<IOrder>(`/orders/${id}`),
  uploadPaymentProof: (orderId: string, paymentProof: string) =>
    fetcher<IOrder>(`/orders/${orderId}/payment-proof`, { method: 'PUT', body: JSON.stringify({ paymentProof }) }),
};
