'use client';

import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useAppStore } from '@shop-ban-nick/shared-web';
import { login as loginApi } from '../services/authService';
import type { LoginFormValues } from '../types';

export function useLogin() {
  const router = useRouter();
  const { setAuth } = useAppStore();

  return useMutation({
    mutationFn: (data: LoginFormValues) => loginApi(data),
    onSuccess: (res) => {
      setAuth(res.user, res.accessToken);
      router.push('/');
    },
  });
}
