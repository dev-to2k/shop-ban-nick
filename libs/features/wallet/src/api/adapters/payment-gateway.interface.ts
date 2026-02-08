export interface CreatePaymentUrlParams {
  requestId: string;
  amount: number;
  userId: string;
  returnUrl: string;
  cancelUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface CreatePaymentUrlResult {
  paymentUrl: string;
  externalId: string;
}

export interface PaymentGatewayAdapter {
  getProviderName(): string;
  createPaymentUrl(params: CreatePaymentUrlParams): Promise<CreatePaymentUrlResult | null>;
  verifyCallback?(payload: unknown): Promise<{ success: boolean; amount?: number; externalId?: string }>;
}
