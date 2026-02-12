'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlus } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, Form, FormInput, FormSubmitError } from '@shared/components';
import { ApiError } from '@shared/api/core';
import { useRegister } from './use-register';
import { registerSchema } from './auth-schema';
import type { RegisterFormValues } from './auth-types';

export function RegisterForm() {
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', phone: '', password: '', confirmPassword: '' },
  });
  const registerMutation = useRegister(form.setError);

  const globalError =
    registerMutation.isError && registerMutation.error instanceof ApiError && registerMutation.error.errors?.length
      ? registerMutation.error.errors.find((e) => e.field === '_' || !e.field)?.message
      : registerMutation.isError && registerMutation.error instanceof Error
        ? registerMutation.error.message
        : null;

  return (
    <div className="container-narrow py-12 sm:py-16 flex flex-col items-center">
      <Card className="w-full max-w-[min(100%,28rem)]">
        <CardHeader className="text-center">
          <CardTitle className="text-fluid-section">Đăng ký</CardTitle>
          <CardDescription>Tạo tài khoản mới để mua acc game</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => registerMutation.mutate(data))} className="space-y-4">
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
