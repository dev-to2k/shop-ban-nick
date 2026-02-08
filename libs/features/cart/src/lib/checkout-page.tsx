'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createOrderSchema, type CreateOrderInput } from '@shop-ban-nick/shared-schemas';
import { Wallet, ArrowLeft, LogIn, Gamepad2, PlusCircle, AlertCircle } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, Separator, Form, FormInput, FormSubmitError, Input, Label } from '@shop-ban-nick/shared-web';
import { useAppStore, useCart, useBreadcrumb, api, queryKeys } from '@shop-ban-nick/shared-web';
import { formatPrice } from '@shop-ban-nick/shared-utils';
import { useCurrencyInput, type ApiError } from '@shop-ban-nick/shared-web';

const CHECKOUT_URL = '/checkout';

export function CheckoutPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { auth } = useAppStore();
  const { cart, clearCart } = useCart();
  const { setItems: setBreadcrumb } = useBreadcrumb();
  const depositCurrency = useCurrencyInput({ max: 999_999_999, initialValue: 0 });

  useEffect(() => {
    setBreadcrumb([{ label: 'Trang chủ', href: '/' }, { label: 'Giỏ hàng', href: '/cart' }, { label: 'Thanh toán' }]);
    return () => setBreadcrumb([]);
  }, [setBreadcrumb]);

  const totalItems = cart.reduce((s, i) => s + (i.quantity ?? 1), 0);
  const total = cart.reduce((sum, item) => {
    const unit = item.discount && item.discount > 0 ? Math.round(item.price * (1 - item.discount / 100)) : item.price;
    return sum + unit * (item.quantity ?? 1);
  }, 0);

  const { data: wallet, isLoading: walletLoading } = useQuery({
    queryKey: queryKeys.wallet.all,
    queryFn: () => api.getWallet(),
    enabled: !!auth.token,
  });

  const balance = wallet?.balance ?? 0;
  const insufficient = balance < total;
  const shortfall = insufficient ? total - balance : 0;

  const form = useForm<CreateOrderInput>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      accountIds: cart.flatMap((i) => Array(i.quantity ?? 1).fill(i.id)),
      paymentMethod: 'WALLET',
      note: '',
    },
  });

  const orderMutation = useMutation({
    mutationFn: (data: CreateOrderInput) => api.createOrder({ ...data, note: data.note || undefined }),
    onSuccess: (order) => {
      clearCart();
      router.push(`/orders/${order.id}`);
    },
  });

  const depositMutation = useMutation({
    mutationFn: (amount: number) =>
      api.createDepositRequest(
        { amount, provider: 'DEMO' },
        `${typeof window !== 'undefined' ? window.location.origin : ''}${CHECKOUT_URL}`,
        CHECKOUT_URL
      ),
    onSuccess: (res) => {
      if (res.paymentUrl) {
        window.location.href = res.paymentUrl;
        return;
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.all });
    },
  });

  const handleDeposit = () => {
    const amount = depositCurrency.numericValue > 0 ? depositCurrency.numericValue : Math.max(shortfall, 10000);
    depositMutation.mutate(amount);
  };

  if (!auth.token) {
    return (
      <div className="container-narrow py-16 sm:py-20 text-center">
        <CardDescription className="mb-4">Vui lòng đăng nhập để thanh toán</CardDescription>
        <Link href="/login"><Button><LogIn className="h-4 w-4 mr-2" />Đăng nhập</Button></Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container-narrow py-16 sm:py-20 text-center">
        <CardDescription className="mb-4">Giỏ hàng trống</CardDescription>
        <Link href="/games"><Button><Gamepad2 className="h-4 w-4 mr-2" />Xem game</Button></Link>
      </div>
    );
  }

  const orderError = orderMutation.error as ApiError & { body?: { code?: string } };
  const showInsufficientUI = insufficient || orderError?.body?.code === 'INSUFFICIENT_BALANCE';

  const onSubmit = (data: CreateOrderInput) => {
    orderMutation.mutate({
      ...data,
      accountIds: cart.flatMap((i) => Array(i.quantity ?? 1).fill(i.id)),
    });
  };

  return (
    <div className="container-narrow py-6 sm:py-8 max-w-3xl">
      <Link href="/cart">
        <Button variant="ghost" size="sm" className="mb-4"><ArrowLeft className="h-4 w-4 mr-1" /> Giỏ hàng</Button>
      </Link>

      <h1 className="text-2xl font-bold mb-6">Thanh toán</h1>

      <FormSubmitError
        error={orderMutation.isError && orderError?.body?.code !== 'INSUFFICIENT_BALANCE' ? orderMutation.error : null}
        fallbackMessage="Đặt hàng thất bại"
        className="mb-4"
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="text-base">Đơn hàng ({totalItems} acc)</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {cart.map((item) => {
                  const qty = item.quantity ?? 1;
                  const unit = item.discount && item.discount > 0 ? Math.round(item.price * (1 - item.discount / 100)) : item.price;
                  return (
                    <div key={item.id} className="flex justify-between py-2 border-b last:border-0">
                      <div>
                        <p className="text-sm font-medium">{item.title}{qty > 1 ? ` × ${qty}` : ''}</p>
                        <CardDescription className="text-xs">{item.gameName} - {item.code}</CardDescription>
                      </div>
                      <span className="text-sm font-semibold tabular-nums">{formatPrice(unit * qty)}</span>
                    </div>
                  );
                })}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Tổng</span>
                  <span className="text-primary tabular-nums">{formatPrice(total)}</span>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader><CardTitle className="text-base">Thanh toán bằng ví</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {walletLoading ? (
                    <p className="text-sm text-muted-foreground">Đang tải số dư...</p>
                  ) : (
                    <>
                      <div className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                        <span className="text-sm text-muted-foreground">Số dư ví</span>
                        <span className="font-semibold tabular-nums">{formatPrice(balance)}</span>
                      </div>
                      {insufficient && (
                        <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                          <AlertCircle className="h-4 w-4 shrink-0" />
                          <span>Thiếu {formatPrice(shortfall)} để thanh toán. Nạp thêm tiền bên dưới rồi đặt hàng.</span>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>

              {showInsufficientUI && (
                <Card className="border-primary/50">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <PlusCircle className="h-4 w-4" /> Nạp tiền nhanh
                    </CardTitle>
                    <CardDescription>Nạp tiền vào ví ngay trên trang này, sau khi nạp xong quay lại để đặt hàng.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <Label>Số tiền cần nạp (VNĐ)</Label>
                      <Input
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        value={depositCurrency.value}
                        onChange={depositCurrency.onChange}
                        placeholder={depositCurrency.formatPlaceholder(shortfall > 0 ? shortfall : 50000)}
                        className="tabular-nums"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      className="w-full"
                      onClick={handleDeposit}
                      disabled={depositMutation.isPending}
                    >
                      {depositMutation.isPending ? 'Đang tạo...' : 'Nạp ngay (quay lại trang thanh toán sau khi nạp)'}
                    </Button>
                    <CardDescription className="text-xs">
                      Bạn sẽ chuyển đến cổng thanh toán; sau khi hoàn tất sẽ tự quay lại trang này.
                    </CardDescription>
                  </CardContent>
                </Card>
              )}

              <FormInput name="note" label="Ghi chú (tuỳ chọn)" placeholder="Ghi chú cho đơn hàng..." />

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={orderMutation.isPending || insufficient || walletLoading}
              >
                <Wallet className="h-4 w-4 mr-2" />
                {orderMutation.isPending ? 'Đang xử lý...' : (
                  <span className="tabular-nums">Thanh toán {formatPrice(total)} từ ví</span>
                )}
              </Button>
              {insufficient && (
                <CardDescription className="text-center text-sm">Nạp đủ tiền vào ví để bấm thanh toán.</CardDescription>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
