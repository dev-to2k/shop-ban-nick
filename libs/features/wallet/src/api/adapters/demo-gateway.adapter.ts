import { PaymentGatewayAdapter } from './payment-gateway.interface';

export class DemoGatewayAdapter implements PaymentGatewayAdapter {
  getProviderName(): string {
    return 'DEMO';
  }

  async createPaymentUrl(): Promise<null> {
    return null;
  }
}
