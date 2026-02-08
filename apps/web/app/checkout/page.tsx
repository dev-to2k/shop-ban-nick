'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { createOrderSchema, type CreateOrderInput } from '@shop-ban-nick/shared-schemas';
import { CreditCard, QrCode, ArrowLeft, LogIn, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { FormInput } from '@/components/ui/form-input';
import { FormSubmitError } from '@/components/ui/form-submit-error';
import { useAppStore } from '@/lib/store';
import { useBreadcrumb } from '@/lib/breadcrumb-context';
import { api } from '@/lib/api';
import { formatPrice } from '@shop-ban-nick/shared-utils';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart, auth } = useAppStore();
  const { setItems: setBreadcrumb } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumb([{ label: 'Trang chủ', href: '/' }, { label: 'Giỏ hàng', href: '/cart' }, { label: 'Thanh toán' }]);
    return () => setBreadcrumb([]);
  }, [setBreadcrumb]);

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const form = useForm<CreateOrderInput>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      accountIds: cart.map((i) => i.id),
      paymentMethod: 'BANK_TRANSFER',
      note: '',
    },
  });

  const paymentMethod = form.watch('paymentMethod');

  const orderMutation = useMutation({
    mutationFn: (data: CreateOrderInput) => api.createOrder({ ...data, note: data.note || undefined }),
    onSuccess: (order) => {
      clearCart();
      router.push(`/orders/${order.id}`);
    },
  });

  if (!auth.token) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground mb-4">Vui lòng đăng nhập để thanh toán</p>
        <Link href="/login"><Button><LogIn className="h-4 w-4 mr-2" />Đăng nhập</Button></Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground mb-4">Giỏ hàng trống</p>
        <Link href="/games"><Button><Gamepad2 className="h-4 w-4 mr-2" />Xem game</Button></Link>
      </div>
    );
  }

  const onSubmit = (data: CreateOrderInput) => {
    orderMutation.mutate(data);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link href="/cart">
        <Button variant="ghost" size="sm" className="mb-4"><ArrowLeft className="h-4 w-4 mr-1" /> Giỏ hàng</Button>
      </Link>

      <h1 className="text-2xl font-bold mb-6">Thanh toán</h1>

      <FormSubmitError error={orderMutation.isError ? orderMutation.error : null} fallbackMessage="Đặt hàng thất bại" className="mb-4" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Order summary */}
            <Card>
              <CardHeader><CardTitle className="text-base">Đơn hàng ({cart.length} acc)</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.gameName} - {item.code}</p>
                    </div>
                    <span className="text-sm font-semibold">{formatPrice(item.price)}</span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Tổng</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Payment */}
            <div className="space-y-4">
              <Card>
                <CardHeader><CardTitle className="text-base">Phương thức thanh toán</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <FormField control={form.control} name="paymentMethod" render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="space-y-3">
                          <button
                            type="button"
                            className={`w-full p-3 rounded-md border text-left flex items-center gap-3 transition-colors ${field.value === 'BANK_TRANSFER' ? 'border-primary bg-primary/5' : 'hover:bg-muted'}`}
                            onClick={() => field.onChange('BANK_TRANSFER')}
                          >
                            <CreditCard className="h-5 w-5" />
                            <div>
                              <p className="font-medium text-sm">Chuyển khoản ngân hàng</p>
                              <p className="text-xs text-muted-foreground">Vietcombank, Techcombank, MB Bank...</p>
                            </div>
                          </button>
                          <button
                            type="button"
                            className={`w-full p-3 rounded-md border text-left flex items-center gap-3 transition-colors ${field.value === 'MOMO' ? 'border-primary bg-primary/5' : 'hover:bg-muted'}`}
                            onClick={() => field.onChange('MOMO')}
                          >
                            <QrCode className="h-5 w-5" />
                            <div>
                              <p className="font-medium text-sm">MoMo</p>
                              <p className="text-xs text-muted-foreground">Quét QR hoặc chuyển tiền MoMo</p>
                            </div>
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-base">Thông tin chuyển khoản</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {paymentMethod === 'BANK_TRANSFER' ? (
                    <>
                      <div className="bg-muted p-3 rounded-md space-y-1">
                        <p><span className="text-muted-foreground">Ngân hàng:</span> <strong>Vietcombank</strong></p>
                        <p><span className="text-muted-foreground">STK:</span> <strong>1234567890</strong></p>
                        <p><span className="text-muted-foreground">Chủ TK:</span> <strong>SHOP ACC GAME</strong></p>
                        <p><span className="text-muted-foreground">Nội dung CK:</span> <strong>{auth.user?.email} {auth.user?.phone || ''}</strong></p>
                      </div>
                      <Badge variant="warning" className="text-xs">Sau khi chuyển khoản, admin sẽ xác nhận trong 5-15 phút</Badge>
                    </>
                  ) : (
                    <div className="bg-muted p-3 rounded-md space-y-1">
                      <p><span className="text-muted-foreground">SĐT MoMo:</span> <strong>0123 456 789</strong></p>
                      <p><span className="text-muted-foreground">Tên:</span> <strong>SHOP ACC GAME</strong></p>
                      <p><span className="text-muted-foreground">Nội dung:</span> <strong>{auth.user?.email}</strong></p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <FormInput name="note" label="Ghi chú (tuỳ chọn)" placeholder="Ghi chú cho đơn hàng..." />

              <Button type="submit" className="w-full" size="lg" disabled={orderMutation.isPending}>
                <CreditCard className="h-4 w-4 mr-2" />
                {orderMutation.isPending ? 'Đang xử lý...' : `Đặt hàng - ${formatPrice(total)}`}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
