export * from './core';
export * from './auth';
export * from './wallet';
export * from './banner';
export * from './game';
export * from './account';
export * from './order';
export * from './upload';
export * from './admin';

import { authApi } from './auth';
import { walletApi } from './wallet';
import { bannerApi } from './banner';
import { gameApi } from './game';
import { accountApi } from './account';
import { orderApi } from './order';
import { adminApi } from './admin';
import { uploadFile } from './upload';

export const api = {
  ...authApi,
  ...walletApi,
  ...bannerApi,
  ...gameApi,
  ...accountApi,
  ...orderApi,
  uploadFile,
  admin: adminApi,
};

import { authQueryKeys } from './auth';
import { walletQueryKeys } from './wallet';
import { bannerQueryKeys } from './banner';
import { gameQueryKeys } from './game';
import { accountQueryKeys } from './account';
import { orderQueryKeys } from './order';
import { adminQueryKeys } from './admin';

export const queryKeys = {
  banners: bannerQueryKeys,
  games: gameQueryKeys,
  accounts: accountQueryKeys,
  orders: orderQueryKeys,
  wallet: walletQueryKeys,
  admin: adminQueryKeys,
};
