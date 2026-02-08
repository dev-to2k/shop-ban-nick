'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { loginSchema, type LoginInput } from '@shop-ban-nick/shared-schemas';
import { LogIn } from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Form,
  FormInput,
  FormSubmitError,
} from '@shop-ban-nick/shared-web';
import { useAppStore, useBreadcrumb, api } from '@shop-ban-nick/shared-web';

export function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAppStore();
  const { setItems: setBreadcrumb } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumb([{ label: 'Trang chủ', href: '/' }, { label: 'Đăng nhập' }]);
    return () => setBreadcrumb([]);
  }, [setBreadcrumb]);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginInput) => api.login(data),
    onSuccess: (res) => {
      setAuth(res.user, res.accessToken);
      router.push('/');
    },
  });

  const onSubmit = (data: LoginInput) => loginMutation.mutate(data);

  return (
    <div className="container-narrow py-12 sm:py-16 flex flex-col items-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Đăng nhập</CardTitle>
          <CardDescription>Nhập email và mật khẩu để tiếp tục</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormSubmitError
                error={loginMutation.isError ? loginMutation.error : null}
                fallbackMessage="Đăng nhập thất bại"
              />
              <FormInput name="email" label="Email" type="email" placeholder="email@example.com" required />
              <FormInput name="password" label="Mật khẩu" type="password" placeholder="••••••••" required />
              <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                <LogIn className="h-4 w-4 mr-2" />
                {loginMutation.isPending ? 'Đang xử lý...' : 'Đăng nhập'}
              </Button>
            </form>
          </Form>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Chưa có tài khoản? <Link href="/register" className="text-primary hover:underline">Đăng ký</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
