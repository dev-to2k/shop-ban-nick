import { z } from 'zod';

export const createOrderSchema = z.object({
  accountIds: z.array(z.string()).min(1, 'Phải chọn ít nhất 1 acc'),
  paymentMethod: z.enum(['BANK_TRANSFER', 'MOMO']),
  note: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'REFUNDED']),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
