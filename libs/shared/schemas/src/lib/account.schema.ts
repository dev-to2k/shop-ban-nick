import { z } from 'zod';

export const createAccountSchema = z.object({
  code: z.string().min(1, 'Mã acc là bắt buộc'),
  gameId: z.string().min(1, 'Game ID là bắt buộc'),
  title: z.string().min(1, 'Tiêu đề là bắt buộc'),
  description: z.string().optional(),
  price: z.number().min(1, 'Giá phải lớn hơn 0'),
  images: z.array(z.string()).optional(),
  attributes: z.record(z.union([z.string(), z.number()])).optional(),
  loginInfo: z.string().optional(),
});

export const updateAccountSchema = createAccountSchema.partial().extend({
  status: z.enum(['AVAILABLE', 'SOLD', 'RESERVED', 'HIDDEN']).optional(),
});

export type CreateAccountInput = z.infer<typeof createAccountSchema>;
export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;
