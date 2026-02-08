'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, History, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription } from '@shop-ban-nick/shared-web';
import { useAppStore, api, queryKeys } from '@shop-ban-nick/shared-web';
import { formatPrice } from '@shop-ban-nick/shared-utils';
import type { IWalletTransaction } from '@shop-ban-nick/shared-types';

const TYPE_LABEL: Record<string, string> = {
  DEPOSIT: 'Nạp tiền',
  PAYMENT: 'Thanh toán',
  REFUND: 'Hoàn tiền',
};

const LIMIT = 20;

export function ProfileTransactionsPage() {
  const router = useRouter();
  const { auth } = useAppStore();
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!auth.user) router.replace('/login');
  }, [auth.user, router]);

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.wallet.transactions({ page, limit: LIMIT }),
    queryFn: () => api.getWalletTransactions({ page, limit: LIMIT }),
    enabled: !!auth.user,
  });

  if (!auth.user) return null;

  const list = data?.data ?? [];
  const meta = data?.meta ?? { total: 0, page: 1, limit: LIMIT, totalPages: 0 };

  return (
    <div className="container-narrow py-6 sm:py-8">
      <Link href="/profile">
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" /> Tài khoản
        </Button>
      </Link>

      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <History className="h-7 w-7" /> Lịch sử giao dịch
      </h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tất cả giao dịch ví</CardTitle>
          <CardDescription>
            Nạp tiền, thanh toán đơn hàng, hoàn tiền. Trang {meta.page} / {meta.totalPages || 1} · Tổng {meta.total} giao dịch
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground py-8 text-center">Đang tải...</p>
          ) : list.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">Chưa có giao dịch nào</p>
          ) : (
            <>
              <ul className="divide-y divide-border">
                {list.map((t: IWalletTransaction) => (
                  <li key={t.id} className="flex items-center justify-between py-3 first:pt-0">
                    <div>
                      <span className="font-medium">{TYPE_LABEL[t.type] ?? t.type}</span>
                      <span className="text-muted-foreground text-sm ml-2">
                        {new Date(t.createdAt).toLocaleString('vi-VN')}
                      </span>
                      {t.referenceId && (
                        <p className="text-xs text-muted-foreground mt-0.5">Mã tham chiếu: {t.referenceId}</p>
                      )}
                    </div>
                    <span
                      className={`tabular-nums font-semibold ${
                        t.amount >= 0 ? 'text-primary' : 'text-destructive'
                      }`}
                    >
                      {t.amount >= 0 ? '+' : ''}{formatPrice(t.amount)}
                    </span>
                  </li>
                ))}
              </ul>
              {meta.totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 mt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" /> Trước
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Trang {meta.page} / {meta.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= meta.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Sau <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <div className="mt-4">
        <Link href="/profile/wallet">
          <Button variant="outline"><History className="h-4 w-4 mr-2" />Ví của tôi</Button>
        </Link>
      </div>
    </div>
  );
}
