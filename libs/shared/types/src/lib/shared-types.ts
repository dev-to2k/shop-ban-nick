// ============ ENUMS ============
export enum Role {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
}

export enum AttributeType {
  TEXT = 'TEXT',
  NUMBER = 'NUMBER',
  SELECT = 'SELECT',
}

export enum AccountStatus {
  AVAILABLE = 'AVAILABLE',
  SOLD = 'SOLD',
  RESERVED = 'RESERVED',
  HIDDEN = 'HIDDEN',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentMethod {
  BANK_TRANSFER = 'BANK_TRANSFER',
  MOMO = 'MOMO',
  WALLET = 'WALLET',
}

export enum WalletTransactionType {
  DEPOSIT = 'DEPOSIT',
  PAYMENT = 'PAYMENT',
  REFUND = 'REFUND',
}

// ============ INTERFACES ============
export interface IUser {
  id: string;
  email: string;
  phone?: string;
  name: string;
  avatar?: string;
  role: Role;
  walletBalance?: number;
  createdAt: string;
  updatedAt: string;
}

export enum PaymentProvider {
  DEMO = 'DEMO',
  MOMO = 'MOMO',
  VNPAY = 'VNPAY',
}

export enum DepositRequestStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  EXPIRED = 'EXPIRED',
}

export interface IDepositRequest {
  id: string;
  userId: string;
  amount: number;
  provider: PaymentProvider;
  status: DepositRequestStatus;
  externalId?: string;
  paymentUrl?: string;
  createdAt: string;
  completedAt?: string;
}

export interface IWalletTransaction {
  id: string;
  userId: string;
  amount: number;
  type: WalletTransactionType;
  referenceId?: string;
  createdAt: string;
}

export interface IGame {
  id: string;
  name: string;
  slug: string;
  thumbnail?: string;
  description?: string;
  isActive: boolean;
  attributes?: IGameAttribute[];
  _count?: { accounts: number };
  createdAt: string;
  updatedAt: string;
}

export interface IGameAttribute {
  id: string;
  gameId: string;
  name: string;
  type: AttributeType;
  options?: string[];
}

export interface IGameAccount {
  id: string;
  code: string;
  gameId: string;
  game?: IGame;
  title: string;
  description?: string;
  price: number;
  images: string[];
  attributes?: Record<string, string | number>;
  status: AccountStatus;
  loginInfo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IOrder {
  id: string;
  userId: string;
  user?: IUser;
  accounts?: IGameAccount[];
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentProof?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

// ============ DTOs ============
export interface RegisterDto {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: IUser;
}

export interface CreateGameDto {
  name: string;
  slug: string;
  thumbnail?: string;
  description?: string;
  attributes?: { name: string; type: AttributeType; options?: string[] }[];
}

export interface UpdateGameDto extends Partial<CreateGameDto> {}

export interface CreateAccountDto {
  code: string;
  gameId: string;
  title: string;
  description?: string;
  price: number;
  images?: string[];
  attributes?: Record<string, string | number>;
  loginInfo?: string;
}

export interface UpdateAccountDto extends Partial<CreateAccountDto> {
  status?: AccountStatus;
}

export interface CreateOrderDto {
  accountIds: string[];
  paymentMethod: PaymentMethod;
  note?: string;
}

export interface UpdateOrderStatusDto {
  status: OrderStatus;
}

// ============ PAGINATION ============
export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AccountFilterQuery extends PaginationQuery {
  minPrice?: number;
  maxPrice?: number;
  status?: AccountStatus;
  attributes?: Record<string, string>;
}
