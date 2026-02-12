'use client';

import { useRouter } from 'next/navigation';
import { UseFormSetError } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useAppStore, ApiError } from '@shop-ban-nick/shared-web';
import { register as registerApi } from '../services/authService';
import type { RegisterFormValues } from '../types';

export function useRegister(setError: UseFormSetError<RegisterFormValues>) {
  const router = useRouter();
  const { setAuth } = useAppStore();

  return useMutation({
    mutationFn: (data: RegisterFormValues) => {
      const { confirmPassword: _, ...payload } = data;
      return registerApi({ ...payload, phone: payload.phone || undefined });
    },
    onSuccess: (res) => {
      setAuth(res.user, res.accessToken);
      router.push('/');
    },
    onError: (err) => {
      if (err instanceof ApiError && err.errors?.length) {
        err.errors.forEach((e) => {
          if (e.field && e.field !== '_') setError(e.field as keyof RegisterFormValues, { type: 'server', message: e.message });
        });
      }
    },
  });
}
