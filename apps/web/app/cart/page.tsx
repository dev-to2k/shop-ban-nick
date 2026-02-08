'use client';

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
import { useAppStore } from '@/lib/store';
import { useBreadcrumb } from '@/lib/breadcrumb-context';
import { formatPrice } from '@shop-ban-nick/shared-utils';

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useAppStore();
  const { setItems: setBreadcrumb } = useBreadcrumb();
  const [removeId, setRemoveId] = useState<string | null>(null);
  const [clearOpen, setClearOpen] = useState(false);

  useEffect(() => {
    setBreadcrumb([{ label: 'Trang chủ', href: '/' }, { label: 'Giỏ hàng' }]);
    return () => setBreadcrumb([]);
  }, [setBreadcrumb]);

  const total = cart.reduce((sum, item) => {
    const p = item.discount && item.discount > 0 ? Math.round(item.price * (1 - item.discount / 100)) : item.price;
    return sum + p;
  }, 0);

  const itemToRemove = removeId ? cart.find((i) => i.id === removeId) : null;

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Giỏ hàng trống</h1>
        <p className="text-muted-foreground mb-6">Hãy chọn acc game bạn yêu thích!</p>
        <Link href="/games"><Button><Gamepad2 className="h-4 w-4 mr-2" />Xem game</Button></Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Giỏ hàng ({cart.length})</h1>
        <Button variant="ghost" size="sm" onClick={() => setClearOpen(true)} className="text-destructive self-start sm:self-auto"><Trash2 className="h-4 w-4 mr-2" />Xóa tất cả</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-3 lg:col-span-2">
          {cart.map((item) => (
            <ProductCard
              key={item.id}
              item={item}
              variant="cart"
              onRemove={setRemoveId}
            />
          ))}
        </div>

        <div className="lg:sticky lg:top-[7.5rem] lg:self-start">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <h3 className="font-semibold mb-4">Tóm tắt đơn hàng</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Số lượng</span>
                  <span>{cart.length} acc</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Tổng cộng</span>
                  <span className="text-primary">{formatPrice(total)}</span>
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
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
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
