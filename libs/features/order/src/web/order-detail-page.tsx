'use client';

import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, Separator, Skeleton } from '@shop-ban-nick/shared-web';
import { api, queryKeys } from '@shop-ban-nick/shared-web';
import { formatPrice } from '@shop-ban-nick/shared-utils';

const statusMap: Record<string, { label: string; variant: 'warning' | 'default' | 'success' | 'destructive' | 'secondary' }> = {
  PENDING: { label: 'Chờ xử lý', variant: 'warning' },
  CONFIRMED: { label: 'Đã xác nhận', variant: 'default' },
  COMPLETED: { label: 'Hoàn thành', variant: 'success' },
  CANCELLED: { label: 'Đã hủy', variant: 'destructive' },
  REFUNDED: { label: 'Đã hoàn tiền', variant: 'secondary' },
};

export function OrderDetailPage({ id }: { id: string }) {
  const { data: order, isLoading } = useQuery({
    queryKey: queryKeys.orders.byId(id),
    queryFn: () => api.getOrderById(id),
  });

  if (isLoading) return <div className="container-narrow py-6 sm:py-8"><Skeleton className="h-64 w-full" /></div>;
  if (!order) return <div className="container-narrow py-16 sm:py-20 text-center text-muted-foreground">Đơn hàng không tồn tại</div>;

  const status = statusMap[order.status] || { label: order.status, variant: 'secondary' as const };
  const accounts = order.accounts ?? [];

  return (
    <div className="container-narrow py-6 sm:py-8 max-w-2xl">
      <Link href="/orders">
        <Button variant="ghost" size="sm" className="mb-4"><ArrowLeft className="h-4 w-4 mr-1" /> Đơn hàng</Button>
      </Link>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Đơn #{order.id.slice(0, 8)}</CardTitle>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleString('vi-VN')}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-sm mb-2">Acc đã mua</h3>
            {accounts.map((acc) => (
              <div key={acc.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="text-sm font-medium">{acc.title}</p>
                  <p className="text-xs text-muted-foreground">{acc.game?.name} &middot; Mã: {acc.code}</p>
                </div>
                <span className="text-sm font-semibold tabular-nums">{formatPrice(Number(acc.price))}</span>
              </div>
            ))}
          </div>
          <Separator />
          <div className="flex justify-between font-bold">
            <span>Tổng cộng</span>
            <span className="text-primary tabular-nums">{formatPrice(Number(order.totalAmount))}</span>
          </div>
          {order.status === 'COMPLETED' && accounts.some((a) => !!a.loginInfo) && (
            <>
              <Separator />
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <h3 className="font-semibold">Thông tin đăng nhập</h3>
                </div>
                {accounts.filter((a) => !!a.loginInfo).map((acc) => (
                  <div key={acc.id} className="bg-muted p-3 rounded-md mb-2">
                    <p className="text-sm font-medium mb-1">{acc.title} ({acc.code})</p>
                    <p className="text-sm font-mono bg-background p-2 rounded-md">{acc.loginInfo}</p>
                  </div>
                ))}
              </div>
            </>
          )}
          <div className="text-sm text-muted-foreground">
            <p>Phương thức: {order.paymentMethod === 'BANK_TRANSFER' ? 'Chuyển khoản' : 'MoMo'}</p>
            {order.note && <p>Ghi chú: {order.note}</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
