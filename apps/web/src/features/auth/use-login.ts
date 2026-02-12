'use client';

import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useAppStore } from '@shared/utils/store';
import { login as loginApi } from './auth-service';
import type { LoginFormValues } from './auth-types';

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
