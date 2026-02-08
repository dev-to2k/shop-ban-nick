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

/**
 * Adapter for payment gateways (Momo, VNPay, ...).
 * DEMO adapter returns null (no redirect); real gateways return paymentUrl for redirect.
 */
export interface PaymentGatewayAdapter {
  getProviderName(): string;

  /**
   * Create payment URL for redirect. Returns null if no redirect (e.g. DEMO flow).
   */
  createPaymentUrl(params: CreatePaymentUrlParams): Promise<CreatePaymentUrlResult | null>;

  /**
   * Optional: verify callback from gateway (IPN/webhook). Return success + amount if valid.
   */
  verifyCallback?(payload: unknown): Promise<{ success: boolean; amount?: number; externalId?: string }>;
}
