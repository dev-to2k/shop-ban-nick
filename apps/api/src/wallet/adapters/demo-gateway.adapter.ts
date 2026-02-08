import { PaymentGatewayAdapter } from './payment-gateway.interface';

/**
 * Demo adapter: no redirect. Frontend will call confirm endpoint after user clicks "Xác nhận đã nạp".
 */
export class DemoGatewayAdapter implements PaymentGatewayAdapter {
  getProviderName(): string {
    return 'DEMO';
  }

  async createPaymentUrl(): Promise<null> {
    return null;
  }
}
