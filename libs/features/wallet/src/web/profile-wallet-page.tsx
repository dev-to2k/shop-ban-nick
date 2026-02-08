'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Wallet, ArrowLeft, PlusCircle, History, CheckCircle } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shop-ban-nick/shared-web';
import { useAppStore, api, queryKeys, useCurrencyInput } from '@shop-ban-nick/shared-web';
import { formatPrice } from '@shop-ban-nick/shared-utils';
import type { IWalletTransaction } from '@shop-ban-nick/shared-types';

const TYPE_LABEL: Record<string, string> = {
  DEPOSIT: 'Nạp tiền',
  PAYMENT: 'Thanh toán',
  REFUND: 'Hoàn tiền',
};

const PROVIDER_LABEL: Record<string, string> = {
  DEMO: 'Demo (xác nhận ngay)',
  MOMO: 'Ví Momo (sắp ra mắt)',
  VNPAY: 'VNPay (sắp ra mắt)',
};

export function ProfileWalletPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { auth } = useAppStore();
  const currencyInput = useCurrencyInput({ max: 100_000_000 });
  const [provider, setProvider] = useState<string>('DEMO');
  const [pendingRequest, setPendingRequest] = useState<{ requestId: string; amount: number } | null>(null);

  useEffect(() => {
    if (!auth.user) router.replace('/login');
  }, [auth.user, router]);

  const { data: wallet, isLoading: walletLoading } = useQuery({
    queryKey: queryKeys.wallet.all,
    queryFn: () => api.getWallet(),
    enabled: !!auth.user,
  });

  const [page, setPage] = useState(1);
  const { data: txData, isLoading: txLoading } = useQuery({
    queryKey: queryKeys.wallet.transactions({ page, limit: 10 }),
    queryFn: () => api.getWalletTransactions({ page, limit: 10 }),
    enabled: !!auth.user,
  });

  const createDepositMutation = useMutation({
    mutationFn: (payload: { amount: number; provider: string }) =>
      api.createDepositRequest({ amount: payload.amount, provider: payload.provider }),
    onSuccess: (res) => {
      if (res.paymentUrl) {
        window.location.href = res.paymentUrl;
        return;
      }
      setPendingRequest({ requestId: res.requestId, amount: res.amount });
    },
    onError: (err: Error & { message?: string }) => {
      toast.error('Tạo yêu cầu nạp tiền thất bại', { description: err.message || 'Vui lòng thử lại' });
    },
  });

  const confirmDepositMutation = useMutation({
    mutationFn: (requestId: string) => api.confirmDepositRequest(requestId),
    onSuccess: (res) => {
      toast.success('Nạp tiền thành công', { description: `Số dư hiện tại: ${formatPrice(res.balance)}` });
      setPendingRequest(null);
      currencyInput.clear();
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.transactions({ page, limit: 10 }) });
    },
    onError: (err: Error & { message?: string }) => {
      toast.error('Xác nhận thất bại', { description: err.message || 'Vui lòng thử lại' });
    },
  });

  const handleCreateDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = currencyInput.numericValue;
    if (value <= 0) {
      toast.error('Nhập số tiền hợp lệ (lớn hơn 0)');
      return;
    }
    createDepositMutation.mutate({ amount: value, provider });
  };

  if (!auth.user) return null;

  return (
    <div className="container-narrow py-6 sm:py-8">
      <Link href="/profile">
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" /> Tài khoản
        </Button>
      </Link>

      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Wallet className="h-7 w-7" /> Ví của tôi
      </h1>

      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Số dư</CardTitle>
            <CardDescription>Dùng để thanh toán đơn hàng (tính năng mở rộng sau)</CardDescription>
          </CardHeader>
          <CardContent>
            {walletLoading ? (
              <p className="text-2xl font-bold text-muted-foreground">Đang tải...</p>
            ) : (
              <p className="text-3xl font-bold text-primary tabular-nums">{formatPrice(wallet?.balance ?? 0)}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Nạp tiền</CardTitle>
            <CardDescription>
              Chọn phương thức và số tiền. Demo: tạo yêu cầu rồi bấm xác nhận. Momo/VNPay: sẽ chuyển sang trang thanh toán (khi tích hợp).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleCreateDeposit} className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="wallet-provider">Phương thức</Label>
                <Select value={provider} onValueChange={setProvider}>
                  <SelectTrigger id="wallet-provider" aria-label="Phương thức thanh toán">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PROVIDER_LABEL).map(([key, label]) => (
                      <SelectItem key={key} value={key} disabled={key !== 'DEMO'}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-end gap-3">
                <div className="space-y-2 flex-1 sm:max-w-[200px]">
                  <Label htmlFor="wallet-amount">Số tiền (VNĐ)</Label>
                  <Input
                    id="wallet-amount"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="Số tiền (VNĐ)"
                    value={currencyInput.value}
                    onChange={currencyInput.onChange}
                    className="tabular-nums"
                  />
                </div>
                <Button type="submit" disabled={createDepositMutation.isPending || provider !== 'DEMO'}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  {createDepositMutation.isPending ? 'Đang tạo...' : 'Tạo yêu cầu nạp tiền'}
                </Button>
              </div>
            </form>

            {pendingRequest && (
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-3">
                <p className="text-sm font-medium">Yêu cầu nạp tiền đã tạo (Demo)</p>
                <p className="text-2xl font-bold text-primary tabular-nums">{formatPrice(pendingRequest.amount)}</p>
                <p className="text-xs text-muted-foreground">Bấm xác nhận để mô phỏng hoàn tất thanh toán và cộng tiền vào ví.</p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => confirmDepositMutation.mutate(pendingRequest.requestId)}
                    disabled={confirmDepositMutation.isPending}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {confirmDepositMutation.isPending ? 'Đang xử lý...' : 'Xác nhận đã nạp (demo)'}
                  </Button>
                  <Button variant="outline" onClick={() => setPendingRequest(null)}>
                    Hủy
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base flex items-center gap-2">
              <History className="h-4 w-4" /> Lịch sử giao dịch
            </CardTitle>
            <Link href="/profile/transactions">
              <Button variant="ghost" size="sm">Xem tất cả</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {txLoading ? (
              <p className="text-sm text-muted-foreground">Đang tải...</p>
            ) : !txData?.data?.length ? (
              <p className="text-sm text-muted-foreground">Chưa có giao dịch nào</p>
            ) : (
              <div className="space-y-2">
                {txData.data.map((t: IWalletTransaction) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0 text-sm"
                  >
                    <div>
                      <span className="font-medium">{TYPE_LABEL[t.type] ?? t.type}</span>
                      <span className="text-muted-foreground ml-2">
                        {new Date(t.createdAt).toLocaleString('vi-VN')}
                      </span>
                    </div>
                    <span className={`tabular-nums ${t.amount >= 0 ? 'text-primary font-semibold' : 'text-destructive'}`}>
                      {t.amount >= 0 ? '+' : ''}{formatPrice(t.amount)}
                    </span>
                  </div>
                ))}
                {txData.meta.totalPages > 1 && (
                  <div className="flex gap-2 pt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      Trước
                    </Button>
                    <span className="flex items-center text-sm text-muted-foreground">
                      {page} / {txData.meta.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= txData.meta.totalPages}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      Sau
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
