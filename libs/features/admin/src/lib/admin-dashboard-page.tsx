'use client';

import { useQuery } from '@tanstack/react-query';
import { Package, Gamepad2, ShoppingCart, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Skeleton } from '@shop-ban-nick/shared-web';
import { api, queryKeys } from '@shop-ban-nick/shared-web';
import { formatPrice } from '@shop-ban-nick/shared-utils';

const cardsConfig = [
  { title: 'Tổng acc', key: 'totalAccounts' as const, icon: Package, color: 'text-blue-500' },
  { title: 'Acc có sẵn', key: 'availableAccounts' as const, icon: Gamepad2, color: 'text-green-500' },
  { title: 'Tổng đơn hàng', key: 'totalOrders' as const, icon: ShoppingCart, color: 'text-purple-500' },
  { title: 'Đơn hôm nay', key: 'ordersToday' as const, icon: ShoppingCart, color: 'text-orange-500' },
  { title: 'Doanh thu', key: 'revenue' as const, icon: DollarSign, color: 'text-emerald-500', format: true },
];

export function AdminDashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: queryKeys.admin.stats,
    queryFn: () => api.admin.getStats(),
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {cardsConfig.map((card) => (
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
                <div className="text-2xl font-bold tabular-nums">
                  {card.format && stats ? formatPrice(Number(stats[card.key])) : (Number(stats?.[card.key]) || 0)}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
