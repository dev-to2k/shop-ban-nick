import { z } from 'zod';

export const paginationMetaSchema = z.object({
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export const authResponseSchema = z.object({
  accessToken: z.string(),
  user: z.object({
    id: z.string(),
    email: z.string(),
    name: z.string(),
    phone: z.string().nullable().optional(),
    role: z.enum(['ADMIN', 'CUSTOMER']),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
});

export type AuthResponse = z.infer<typeof authResponseSchema>;
export type PaginationMeta = z.infer<typeof paginationMetaSchema>;
export type PaginatedResponse<T> = { data: T[]; meta: PaginationMeta };
