'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Package, LogIn, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api';
import { useBreadcrumb } from '@/lib/breadcrumb-context';
import { queryKeys } from '@/lib/query-keys';
import { useAppStore } from '@/lib/store';
import { formatPrice } from '@shop-ban-nick/shared-utils';

const statusMap: Record<string, { label: string; variant: any }> = {
  PENDING: { label: 'Chờ xử lý', variant: 'warning' },
  CONFIRMED: { label: 'Đã xác nhận', variant: 'default' },
  COMPLETED: { label: 'Hoàn thành', variant: 'success' },
  CANCELLED: { label: 'Đã hủy', variant: 'destructive' },
  REFUNDED: { label: 'Đã hoàn tiền', variant: 'secondary' },
};

export default function OrdersPage() {
  const { auth } = useAppStore();
  const { setItems: setBreadcrumb } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumb([{ label: 'Trang chủ', href: '/' }, { label: 'Đơn hàng' }]);
    return () => setBreadcrumb([]);
  }, [setBreadcrumb]);

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.orders.my(),
    queryFn: () => api.getMyOrders(),
    enabled: !!auth.token,
  });

  const orders = data?.data ?? [];

  if (!auth.token) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground mb-4">Vui lòng đăng nhập để xem đơn hàng</p>
        <Link href="/login"><Button><LogIn className="h-4 w-4 mr-2" />Đăng nhập</Button></Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Đơn hàng của tôi</h1>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">Bạn chưa có đơn hàng nào</p>
          <Link href="/games"><Button><ShoppingCart className="h-4 w-4 mr-2" />Mua acc ngay</Button></Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order: any) => {
            const status = statusMap[order.status] || { label: order.status, variant: 'secondary' };
            return (
              <Link key={order.id} href={`/orders/${order.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">#{order.id.slice(0, 8)}</span>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {order.accounts?.length || 0} acc &middot; {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <span className="font-bold text-primary">{formatPrice(Number(order.totalAmount))}</span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
