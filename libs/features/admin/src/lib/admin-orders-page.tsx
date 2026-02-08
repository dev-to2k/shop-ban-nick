'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShoppingCart, CheckCircle, XCircle, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { OrderStatus } from '@shop-ban-nick/shared-types';
import { Button, Card, CardContent, Badge, Skeleton } from '@shop-ban-nick/shared-web';
import { api, useBreadcrumb, queryKeys } from '@shop-ban-nick/shared-web';
import { formatPrice } from '@shop-ban-nick/shared-utils';

const statusMap: Record<string, { label: string; variant: 'warning' | 'default' | 'success' | 'destructive' | 'secondary' }> = {
  PENDING: { label: 'Chờ xử lý', variant: 'warning' },
  CONFIRMED: { label: 'Đã xác nhận', variant: 'default' },
  COMPLETED: { label: 'Hoàn thành', variant: 'success' },
  CANCELLED: { label: 'Đã hủy', variant: 'destructive' },
  REFUNDED: { label: 'Hoàn tiền', variant: 'secondary' },
};

export function AdminOrdersPage() {
  const queryClient = useQueryClient();
  const { setItems: setBreadcrumb } = useBreadcrumb();
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setBreadcrumb([{ label: 'Trang chủ', href: '/' }, { label: 'Admin', href: '/admin' }, { label: 'Đơn hàng' }]);
    return () => setBreadcrumb([]);
  }, [setBreadcrumb]);

  const params: Record<string, string> = { page: String(page), limit: '20' };
  if (filter) params.status = filter;

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.admin.orders(params),
    queryFn: () => api.admin.getOrders(params),
  });

  const orders = data?.data ?? [];
  const meta = data?.meta ?? null;

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) => api.admin.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
    },
    onError: (err: Error & { message?: string }) => {
      alert(err.message);
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Quản lý đơn hàng</h1>

      <div className="flex gap-2 mb-4 flex-wrap">
        {[{ value: '', label: 'Tất cả' }, ...Object.entries(statusMap).map(([k, v]) => ({ value: k, label: v.label }))].map((f) => (
          <Button key={f.value} variant={filter === f.value ? 'default' : 'outline'} size="sm" onClick={() => { setFilter(f.value); setPage(1); }}>
            <Filter className="h-4 w-4 mr-1" />{f.label}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <ShoppingCart className="h-12 w-12 mx-auto mb-4" />
          <p>Không có đơn hàng nào</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order: {
            id: string;
            status: string;
            user?: { name?: string; email?: string };
            accounts?: { id: string; code: string; title: string; price: string | number; game?: { name: string } }[];
            createdAt: string;
            totalAmount: string | number;
            paymentMethod?: string;
            paymentProof?: string;
            note?: string;
          }) => {
            const status = statusMap[order.status] || { label: order.status, variant: 'secondary' as const };
            const expanded = expandedId === order.id;

            return (
              <Card key={order.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpandedId(expanded ? null : order.id)}>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">#{order.id.slice(0, 8)}</span>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {order.user?.name} ({order.user?.email}) &middot; {order.accounts?.length || 0} acc &middot; {new Date(order.createdAt).toLocaleString('vi-VN')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold tabular-nums">{formatPrice(Number(order.totalAmount))}</p>
                      <p className="text-xs text-muted-foreground">{order.paymentMethod === 'BANK_TRANSFER' ? 'Chuyển khoản' : 'MoMo'}</p>
                    </div>
                  </div>

                  {expanded && (
                    <div className="mt-4 pt-4 border-t space-y-3">
                      <div>
                        <p className="text-sm font-medium mb-2">Acc trong đơn:</p>
                        {order.accounts?.map((acc) => (
                          <div key={acc.id} className="flex justify-between text-sm py-1 border-b last:border-0">
                            <span>{acc.game?.name} - {acc.code} - {acc.title}</span>
                            <span className="tabular-nums">{formatPrice(Number(acc.price))}</span>
                          </div>
                        ))}
                      </div>

                      {order.paymentProof && (
                        <div>
                          <p className="text-sm font-medium mb-1">Ảnh chuyển khoản:</p>
                          <Image src={order.paymentProof} alt="Payment proof" width={320} height={240} className="max-w-xs rounded-md border" />
                        </div>
                      )}

                      {order.note && <p className="text-sm"><strong>Ghi chú:</strong> {order.note}</p>}

                      <div className="flex gap-2">
                        {order.status === 'PENDING' && (
                          <>
                            <Button size="sm" onClick={() => statusMutation.mutate({ id: order.id, status: OrderStatus.CONFIRMED })} disabled={statusMutation.isPending}>
                              <CheckCircle className="h-4 w-4 mr-1" /> Xác nhận
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => statusMutation.mutate({ id: order.id, status: OrderStatus.CANCELLED })} disabled={statusMutation.isPending}>
                              <XCircle className="h-4 w-4 mr-1" /> Hủy
                            </Button>
                          </>
                        )}
                        {order.status === 'CONFIRMED' && (
                          <Button size="sm" onClick={() => statusMutation.mutate({ id: order.id, status: OrderStatus.COMPLETED })} disabled={statusMutation.isPending}>
                            <CheckCircle className="h-4 w-4 mr-1" /> Hoàn thành
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}><ChevronLeft className="h-4 w-4 mr-1" />Trước</Button>
          <span className="flex items-center text-sm">{page}/{meta.totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= meta.totalPages} onClick={() => setPage(page + 1)}>Sau<ChevronRight className="h-4 w-4 ml-1" /></Button>
        </div>
      )}
    </div>
  );
}
