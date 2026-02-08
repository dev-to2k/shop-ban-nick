'use client';

import { useAutoAnimate } from '@formkit/auto-animate/react';
import { AUTO_ANIMATE_CONFIG } from '@/lib/auto-animate-config';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Gamepad2, Trash2, CreditCard, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ProductCard } from '@/components/product/product-card';
import { useCart } from '@/lib/cart-context';
import { useBreadcrumb } from '@/lib/breadcrumb-context';
import { formatPrice } from '@shop-ban-nick/shared-utils';

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const { setItems: setBreadcrumb } = useBreadcrumb();
  const [cartListRef, setAutoAnimateEnabled] = useAutoAnimate<HTMLDivElement>(AUTO_ANIMATE_CONFIG);
  const [removeId, setRemoveId] = useState<string | null>(null);
  const [clearOpen, setClearOpen] = useState(false);

  useEffect(() => {
    setBreadcrumb([{ label: 'Trang chủ', href: '/' }, { label: 'Giỏ hàng' }]);
    return () => setBreadcrumb([]);
  }, [setBreadcrumb]);

  const totalItems = cart.reduce((s, i) => s + (i.quantity ?? 1), 0);
  const total = cart.reduce((sum, item) => {
    const unit = item.discount && item.discount > 0 ? Math.round(item.price * (1 - item.discount / 100)) : item.price;
    return sum + unit * (item.quantity ?? 1);
  }, 0);

  const itemToRemove = removeId ? cart.find((i) => i.id === removeId) : null;

  if (cart.length === 0) {
    return (
      <div className="container-narrow py-12 sm:py-16">
        <Card className="max-w-lg mx-auto bg-card/50">
          <CardContent className="pt-10 pb-10 px-6 sm:px-10 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-6">
              <ShoppingBag className="h-10 w-10" aria-hidden />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Giỏ hàng trống</h1>
            <p className="text-muted-foreground text-sm sm:text-base mb-6 max-w-sm mx-auto">
              Khám phá acc game chất lượng, thêm vào giỏ và thanh toán nhanh chóng.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/games">
                <Button className="w-full sm:w-auto" size="lg">
                  <Gamepad2 className="h-4 w-4 mr-2" />Xem danh sách game
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full sm:w-auto" size="lg">
                  Về trang chủ
                </Button>
              </Link>
            </div>
            <p className="text-xs text-muted-foreground mt-6 pt-6 border-t border-border">
              Giao dịch an toàn · Giá tốt · Hỗ trợ 24/7
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container-narrow py-6 sm:py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
        <h1 className="text-fluid-section font-bold">Giỏ hàng ({totalItems})</h1>
        <Button variant="ghost" size="sm" onClick={() => setClearOpen(true)} className="text-destructive self-start sm:self-auto"><Trash2 className="h-4 w-4 mr-2" />Xóa tất cả</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div ref={cartListRef} data-auto-animate className="space-y-3 lg:col-span-2">
          {cart.map((item) => (
            <ProductCard
              key={item.id}
              item={item}
              variant="cart"
              quantity={item.quantity ?? 1}
              onRemove={setRemoveId}
            />
          ))}
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <h3 className="font-semibold mb-4">Tóm tắt đơn hàng</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Số lượng</span>
                  <span>{totalItems} acc</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Tổng cộng</span>
                  <span className="text-primary tabular-nums">{formatPrice(total)}</span>
                </div>
              </div>
              <Link href="/checkout" className="block mt-4">
                <Button className="w-full" size="lg"><CreditCard className="h-4 w-4 mr-2" />Thanh toán</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={!!removeId} onOpenChange={(open) => !open && setRemoveId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa khỏi giỏ hàng?</AlertDialogTitle>
            <AlertDialogDescription>
              {itemToRemove ? `Xóa "${itemToRemove.title}" khỏi giỏ hàng?` : 'Bạn có chắc muốn xóa?'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel><X className="h-4 w-4 mr-2" />Hủy</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={() => {
                if (removeId) {
                  removeFromCart(removeId);
                  setRemoveId(null);
                }
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={clearOpen} onOpenChange={setClearOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa tất cả giỏ hàng?</AlertDialogTitle>
            <AlertDialogDescription>Toàn bộ acc trong giỏ sẽ bị xóa. Bạn có chắc?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel><X className="h-4 w-4 mr-2" />Hủy</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={() => {
                setAutoAnimateEnabled(false);
                clearCart();
                setClearOpen(false);
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />Xóa tất cả
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
