import { z } from 'zod';

export const roleSchema = z.enum(['ADMIN', 'CUSTOMER']);
export const attributeTypeSchema = z.enum(['TEXT', 'NUMBER', 'SELECT']);
export const accountStatusSchema = z.enum(['AVAILABLE', 'SOLD', 'RESERVED', 'HIDDEN']);
export const orderStatusSchema = z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'REFUNDED']);
export const paymentMethodSchema = z.enum(['BANK_TRANSFER', 'MOMO', 'WALLET']);
export const walletTransactionTypeSchema = z.enum(['DEPOSIT', 'PAYMENT', 'REFUND']);
export const paymentProviderSchema = z.enum(['DEMO', 'MOMO', 'VNPAY']);
export const depositRequestStatusSchema = z.enum(['PENDING', 'COMPLETED', 'FAILED', 'EXPIRED']);

export type Role = z.infer<typeof roleSchema>;
export type AttributeType = z.infer<typeof attributeTypeSchema>;
export type AccountStatus = z.infer<typeof accountStatusSchema>;
export type OrderStatus = z.infer<typeof orderStatusSchema>;
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;
export type WalletTransactionType = z.infer<typeof walletTransactionTypeSchema>;
export type PaymentProvider = z.infer<typeof paymentProviderSchema>;
export type DepositRequestStatus = z.infer<typeof depositRequestStatusSchema>;

export const Role = { ADMIN: 'ADMIN', CUSTOMER: 'CUSTOMER' } as const;
export const AttributeType = { TEXT: 'TEXT', NUMBER: 'NUMBER', SELECT: 'SELECT' } as const;
export const AccountStatus = { AVAILABLE: 'AVAILABLE', SOLD: 'SOLD', RESERVED: 'RESERVED', HIDDEN: 'HIDDEN' } as const;
export const OrderStatus = { PENDING: 'PENDING', CONFIRMED: 'CONFIRMED', COMPLETED: 'COMPLETED', CANCELLED: 'CANCELLED', REFUNDED: 'REFUNDED' } as const;
export const PaymentMethod = { BANK_TRANSFER: 'BANK_TRANSFER', MOMO: 'MOMO', WALLET: 'WALLET' } as const;
export const WalletTransactionType = { DEPOSIT: 'DEPOSIT', PAYMENT: 'PAYMENT', REFUND: 'REFUND' } as const;
export const PaymentProvider = { DEMO: 'DEMO', MOMO: 'MOMO', VNPAY: 'VNPAY' } as const;
export const DepositRequestStatus = { PENDING: 'PENDING', COMPLETED: 'COMPLETED', FAILED: 'FAILED', EXPIRED: 'EXPIRED' } as const;
