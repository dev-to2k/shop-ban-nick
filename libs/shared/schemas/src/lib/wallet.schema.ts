import { z } from 'zod';

export const depositSchema = z.object({
  amount: z.number().min(1, 'Số tiền phải lớn hơn 0').max(100_000_000, 'Số tiền tối đa 100.000.000'),
});

export type DepositInput = z.infer<typeof depositSchema>;
