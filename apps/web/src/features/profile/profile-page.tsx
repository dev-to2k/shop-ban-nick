'use client';

import { formatPrice } from '@shop-ban-nick/shared-utils';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input } from '@shared/components';
import { api, getAssetUrl } from '@shared/api';
import { useAppStore } from '@shared/utils/store';
import { useMutation } from '@tanstack/react-query';
import { Camera, History, Mail, Package, Phone, Shield, User, Wallet } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

export function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { auth, setAuth } = useAppStore();

  useEffect(() => {
    if (!auth.user) router.replace('/login');
  }, [auth.user, router]);

  const updateProfileMutation = useMutation({
    mutationFn: (dto: { avatar?: string }) => api.updateProfile(dto),
    onSuccess: (user) => {
      if (auth.token) setAuth(user, auth.token);
      toast.success('Đã cập nhật avatar');
    },
    onError: () => toast.error('Cập nhật avatar thất bại'),
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => api.uploadFile(file),
    onSuccess: (data) => {
      updateProfileMutation.mutate({ avatar: data.url });
    },
    onError: () => toast.error('Tải ảnh lên thất bại'),
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Chọn file ảnh (JPG, PNG, WebP)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ảnh tối đa 5MB');
      return;
    }
    uploadMutation.mutate(file);
    e.target.value = '';
  };

  if (!auth.user) return null;

  const u = auth.user;
  const avatarUrl = u.avatar ? getAssetUrl(u.avatar) : null;
  const isLoading = uploadMutation.isPending || updateProfileMutation.isPending;

  return (
    <div className="container-narrow py-12 sm:py-16">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            aria-label="Chọn ảnh đại diện"
            onChange={handleAvatarChange}
          />
          <div className="mx-auto relative inline-block mb-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              aria-label="Đổi avatar"
              className="!h-16 !w-16 !min-w-0 rounded-full overflow-hidden bg-primary/10 text-primary hover:bg-primary/20"
            >
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt=""
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                  unoptimized
                  sizes="64px"
                />
              ) : (
                <User className="h-8 w-8" />
              )}
            </Button>
            <span className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-background border shadow-sm">
              <Camera className="h-3.5 w-3.5 text-muted-foreground" />
            </span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mb-1"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            {isLoading ? 'Đang tải...' : 'Đổi avatar'}
          </Button>
          <CardTitle className="text-xl">{u.name}</CardTitle>
          <CardDescription>Thông tin tài khoản</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 rounded-lg border p-3">
            <Mail className="h-5 w-5 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium">{u.email}</p>
            </div>
          </div>
          {u.phone && (
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <Phone className="h-5 w-5 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Số điện thoại</p>
                <p className="text-sm font-medium">{u.phone}</p>
              </div>
            </div>
          )}
          {u.role === 'ADMIN' && (
            <div className="flex items-center gap-3 rounded-lg border bg-primary/5 p-3">
              <Shield className="h-5 w-5 shrink-0 text-primary" />
              <p className="text-sm font-medium">Quản trị viên</p>
            </div>
          )}
          <Link href="/profile/wallet" className="block">
            <Button variant="outline" className="w-full">
              <Wallet className="h-4 w-4 mr-2" />
              Ví của tôi
              {typeof u.walletBalance === 'number' && (
                <span className="ml-2 text-primary font-semibold tabular-nums">
                  ({formatPrice(u.walletBalance)})
                </span>
              )}
            </Button>
          </Link>
          <Link href="/profile/transactions" className="block">
            <Button variant="outline" className="w-full">
              <History className="h-4 w-4 mr-2" />
              Lịch sử giao dịch
            </Button>
          </Link>
          <Link href="/orders" className="block">
            <Button variant="outline" className="w-full">
              <Package className="h-4 w-4 mr-2" />
              Đơn hàng của tôi
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
