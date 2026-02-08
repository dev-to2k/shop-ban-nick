'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { UserPlus } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, Form, FormInput, FormSubmitError } from '@shop-ban-nick/shared-web';
import { useAppStore, useBreadcrumb, api, ApiError } from '@shop-ban-nick/shared-web';

const registerSchema = z
  .object({
    name: z.string().min(1, 'Họ tên là bắt buộc'),
    email: z.string().min(1, 'Email là bắt buộc').email('Email không hợp lệ'),
    phone: z.string().optional(),
    password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
    confirmPassword: z.string().min(1, 'Xác nhận mật khẩu là bắt buộc'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu không khớp',
    path: ['confirmPassword'],
  });
type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAppStore();
  const { setItems: setBreadcrumb } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumb([{ label: 'Trang chủ', href: '/' }, { label: 'Đăng ký' }]);
    return () => setBreadcrumb([]);
  }, [setBreadcrumb]);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', phone: '', password: '', confirmPassword: '' },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterFormValues) => {
      const { confirmPassword: _, ...payload } = data;
      return api.register({ ...payload, phone: payload.phone || undefined });
    },
    onSuccess: (res) => {
      setAuth(res.user, res.accessToken);
      router.push('/');
    },
    onError: (err) => {
      if (err instanceof ApiError && err.errors?.length) {
        err.errors.forEach((e) => {
          if (e.field && e.field !== '_') form.setError(e.field as keyof RegisterFormValues, { type: 'server', message: e.message });
        });
      }
    },
  });

  const globalError =
    registerMutation.isError && registerMutation.error instanceof ApiError && registerMutation.error.errors?.length
      ? registerMutation.error.errors.find((e) => e.field === '_' || !e.field)?.message
      : registerMutation.isError && registerMutation.error instanceof Error
        ? registerMutation.error.message
        : null;

  const onSubmit = (data: RegisterFormValues) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="container-narrow py-12 sm:py-16 flex flex-col items-center">
      <Card className="w-full max-w-[min(100%,28rem)]">
        <CardHeader className="text-center">
          <CardTitle className="text-fluid-section">Đăng ký</CardTitle>
          <CardDescription>Tạo tài khoản mới để mua acc game</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormSubmitError error={globalError ? new Error(globalError) : null} fallbackMessage="Đăng ký thất bại" />
              <FormInput name="name" label="Họ tên" placeholder="Nguyễn Văn A" required data-testid="register-name" />
              <FormInput name="email" label="Email" type="email" placeholder="email@example.com" required data-testid="register-email" />
              <FormInput name="phone" label="Số điện thoại" placeholder="0123 456 789 (tuỳ chọn)" data-testid="register-phone" />
              <FormInput name="password" label="Mật khẩu" type="password" placeholder="••••••••" required data-testid="register-password" />
              <FormInput name="confirmPassword" label="Xác nhận mật khẩu" type="password" placeholder="••••••••" required data-testid="register-confirmPassword" />
              <Button type="submit" className="w-full" disabled={registerMutation.isPending} data-testid="register-submit">
                <UserPlus className="h-4 w-4 mr-2" />
                {registerMutation.isPending ? 'Đang xử lý...' : 'Đăng ký'}
              </Button>
            </form>
          </Form>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Đã có tài khoản? <Link href="/login" className="text-primary hover:underline">Đăng nhập</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
