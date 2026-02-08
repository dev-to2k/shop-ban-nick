import { Gamepad2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 font-bold text-lg mb-3">
              <Gamepad2 className="h-5 w-5" />
              <span>ShopAcc</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Chuyên mua bán acc game uy tín, giá rẻ. Giao dịch nhanh chóng, an toàn.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Liên hệ</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>Zalo: 0123 456 789</p>
              <p>Facebook: fb.com/shopacc</p>
              <p>Email: support@shopacc.vn</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Thanh toán</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>Ngân hàng: Vietcombank</p>
              <p>STK: 1234567890</p>
              <p>Chủ TK: SHOP ACC GAME</p>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <p className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} ShopAcc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
