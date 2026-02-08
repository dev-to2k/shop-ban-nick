'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Package, Gamepad2, ShoppingCart, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api';
import { queryKeys } from '@/lib/query-keys';
import { useBreadcrumb } from '@/lib/breadcrumb-context';
import { formatPrice } from '@shop-ban-nick/shared-utils';

export default function AdminDashboard() {
  const { setItems: setBreadcrumb } = useBreadcrumb();
  useEffect(() => {
    setBreadcrumb([{ label: 'Trang chủ', href: '/' }, { label: 'Admin' }]);
    return () => setBreadcrumb([]);
  }, [setBreadcrumb]);

  const { data: stats, isLoading } = useQuery({
    queryKey: queryKeys.admin.stats,
    queryFn: () => api.admin.getStats(),
  });

  const cards = [
    { title: 'Tổng acc', value: stats?.totalAccounts, icon: Package, color: 'text-blue-500' },
    { title: 'Acc có sẵn', value: stats?.availableAccounts, icon: Gamepad2, color: 'text-green-500' },
    { title: 'Tổng đơn hàng', value: stats?.totalOrders, icon: ShoppingCart, color: 'text-purple-500' },
    { title: 'Đơn hôm nay', value: stats?.ordersToday, icon: ShoppingCart, color: 'text-orange-500' },
    { title: 'Doanh thu', value: stats ? formatPrice(Number(stats.revenue)) : null, icon: DollarSign, color: 'text-emerald-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold">{card.value ?? 0}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
