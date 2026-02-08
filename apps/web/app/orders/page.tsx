'use client';

import { useAutoAnimate } from '@formkit/auto-animate/react';
import { AUTO_ANIMATE_CONFIG } from '@/lib/auto-animate-config';
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
  const [ordersListRef] = useAutoAnimate<HTMLDivElement>(AUTO_ANIMATE_CONFIG);

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
      <div className="container-narrow py-12 sm:py-16">
        <Card className="max-w-lg mx-auto bg-card/50">
          <CardContent className="pt-10 pb-10 px-6 sm:px-10 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-6">
              <Package className="h-10 w-10" aria-hidden />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Đăng nhập để xem đơn hàng</h2>
            <p className="text-muted-foreground text-sm sm:text-base mb-6 max-w-sm mx-auto">
              Đăng nhập tài khoản để xem lịch sử đơn hàng và theo dõi trạng thái giao dịch.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/login">
                <Button className="w-full sm:w-auto" size="lg">
                  <LogIn className="h-4 w-4 mr-2" />Đăng nhập
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full sm:w-auto" size="lg">
                  Về trang chủ
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container-narrow py-6 sm:py-8">
      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}</div>
      ) : orders.length === 0 ? (
        <Card className="max-w-lg mx-auto bg-card/50">
          <CardContent className="pt-10 pb-10 px-6 sm:px-10 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-6">
              <Package className="h-10 w-10" aria-hidden />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Bạn chưa có đơn hàng nào</h2>
            <p className="text-muted-foreground text-sm sm:text-base mb-6 max-w-sm mx-auto">
              Khám phá acc game chất lượng, đặt hàng và theo dõi đơn tại đây.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/games">
                <Button className="w-full sm:w-auto" size="lg">
                  <ShoppingCart className="h-4 w-4 mr-2" />Mua acc ngay
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full sm:w-auto" size="lg">
                  Về trang chủ
                </Button>
              </Link>
            </div>
            <p className="text-xs text-muted-foreground mt-6 pt-6 border-t border-border">
              Giao dịch an toàn · Hỗ trợ 24/7
            </p>
          </CardContent>
        </Card>
      ) : (
        <div ref={ordersListRef} data-auto-animate className="space-y-3">
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
                    <span className="font-bold text-primary tabular-nums">{formatPrice(Number(order.totalAmount))}</span>
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
