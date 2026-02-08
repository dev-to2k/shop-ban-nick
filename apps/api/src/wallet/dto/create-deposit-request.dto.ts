export class CreateDepositRequestDto {
  amount: number;
  provider?: string; // 'DEMO' | 'MOMO' | 'VNPAY', default DEMO
}
