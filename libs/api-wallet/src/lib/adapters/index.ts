import { PaymentGatewayAdapter } from './payment-gateway.interface';
import { DemoGatewayAdapter } from './demo-gateway.adapter';

const adapters: Record<string, PaymentGatewayAdapter> = {
  DEMO: new DemoGatewayAdapter(),
};

export function getPaymentAdapter(provider: string): PaymentGatewayAdapter {
  const adapter = adapters[provider];
  if (!adapter) throw new Error(`Unsupported payment provider: ${provider}`);
  return adapter;
}

export { PaymentGatewayAdapter, CreatePaymentUrlParams, CreatePaymentUrlResult } from './payment-gateway.interface';
export { DemoGatewayAdapter } from './demo-gateway.adapter';
