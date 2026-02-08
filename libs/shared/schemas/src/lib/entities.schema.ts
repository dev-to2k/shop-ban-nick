import { z } from 'zod';
import { roleSchema, accountStatusSchema, orderStatusSchema, paymentMethodSchema, walletTransactionTypeSchema } from './enums.schema';

export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  phone: z.string().nullable().optional(),
  name: z.string(),
  avatar: z.string().nullable().optional(),
  role: roleSchema,
  walletBalance: z.number().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const gameAttributeSchema = z.object({
  id: z.string(),
  gameId: z.string(),
  name: z.string(),
  type: z.enum(['TEXT', 'NUMBER', 'SELECT']),
  options: z.array(z.string()).nullable().optional(),
});

export const gameSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  thumbnail: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  isActive: z.boolean(),
  attributes: z.array(gameAttributeSchema).optional(),
  _count: z.object({ accounts: z.number() }).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const gameAccountSchema = z.object({
  id: z.string(),
  code: z.string(),
  gameId: z.string(),
  game: gameSchema.optional(),
  title: z.string(),
  description: z.string().nullable().optional(),
  price: z.number(),
  images: z.array(z.string()),
  attributes: z.record(z.string(), z.union([z.string(), z.number()])).nullable().optional(),
  status: accountStatusSchema,
  loginInfo: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const orderSchema = z.object({
  id: z.string(),
  userId: z.string(),
  user: userSchema.optional(),
  accounts: z.array(gameAccountSchema).optional(),
  totalAmount: z.number(),
  status: orderStatusSchema,
  paymentMethod: paymentMethodSchema,
  paymentProof: z.string().nullable().optional(),
  note: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const walletTransactionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  amount: z.number(),
  type: walletTransactionTypeSchema,
  referenceId: z.string().nullable().optional(),
  createdAt: z.string(),
});

export const adminStatsSchema = z.object({
  totalAccounts: z.number(),
  availableAccounts: z.number(),
  totalOrders: z.number(),
  ordersToday: z.number(),
  revenue: z.number(),
});

export const paginationQuerySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const accountFilterQuerySchema = paginationQuerySchema.extend({
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  status: accountStatusSchema.optional(),
  attributes: z.record(z.string(), z.string()).optional(),
});

export type IUser = z.infer<typeof userSchema>;
export type IGameAttribute = z.infer<typeof gameAttributeSchema>;
export type IGame = z.infer<typeof gameSchema>;
export type IGameAccount = z.infer<typeof gameAccountSchema>;
export type IOrder = z.infer<typeof orderSchema>;
export type IWalletTransaction = z.infer<typeof walletTransactionSchema>;
export type IAdminStats = z.infer<typeof adminStatsSchema>;
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
export type AccountFilterQuery = z.infer<typeof accountFilterQuerySchema>;
