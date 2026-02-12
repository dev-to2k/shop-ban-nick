import type { LoginInput, RegisterInput, AuthResponse } from '@shop-ban-nick/shared-schemas';
import type { IUser } from '@shop-ban-nick/shared-types';
import { fetcher } from '@shop-ban-nick/shared-web';

export async function login(payload: LoginInput): Promise<AuthResponse> {
  return fetcher<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify(payload) });
}

export async function register(payload: Omit<RegisterInput, 'confirmPassword'>): Promise<AuthResponse> {
  return fetcher<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
}

export function getProfile(): Promise<IUser> {
  return fetcher<IUser>('/auth/profile');
}

export function updateProfile(dto: { name?: string; phone?: string; avatar?: string }): Promise<IUser> {
  return fetcher<IUser>('/auth/profile', { method: 'PATCH', body: JSON.stringify(dto) });
}
