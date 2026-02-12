import type { LoginInput, RegisterInput, AuthResponse } from '@shop-ban-nick/shared-schemas';
import type { IUser } from '@shop-ban-nick/shared-types';
import { fetcher } from '../core';

export const authApi = {
  register: (data: Omit<RegisterInput, 'confirmPassword'>) =>
    fetcher<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: LoginInput) =>
    fetcher<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  getProfile: () => fetcher<IUser>('/auth/profile'),
  updateProfile: (dto: { name?: string; phone?: string; avatar?: string }) =>
    fetcher<IUser>('/auth/profile', { method: 'PATCH', body: JSON.stringify(dto) }),
};
