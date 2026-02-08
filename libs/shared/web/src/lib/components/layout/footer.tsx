import { Gamepad2 } from 'lucide-react';
import { Separator } from '../ui/separator';
import { contact } from '../../config';

export function Footer() {
  return (
    <footer className="border-t border-neutral-800 bg-neutral-900 text-neutral-300">
      <div className="container-narrow py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          <section>
            <div className="flex items-center gap-2 font-bold text-lg mb-3 text-white">
              <Gamepad2 className="h-5 w-5" />
              <span>ShopAcc</span>
            </div>
            <p className="text-sm text-neutral-400">
              Chuyên mua bán acc game uy tín, giá rẻ. Giao dịch nhanh chóng, an toàn.
            </p>
          </section>

          <section>
            <h3 className="font-semibold mb-3 text-white">Liên hệ</h3>
            <div className="space-y-1 text-sm text-neutral-400">
              {contact.zaloPhone && <p>Zalo: {contact.zaloPhone}</p>}
              <p><a href={contact.facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">Facebook</a></p>
              <p><a href={`mailto:${contact.supportEmail}`} className="hover:text-white">{contact.supportEmail}</a></p>
            </div>
          </section>

          <section>
            <h3 className="font-semibold mb-3 text-white">Thanh toán</h3>
            <div className="space-y-1 text-sm text-neutral-400">
              <p>Ngân hàng: {contact.bank.name}</p>
              <p>STK: {contact.bank.account}</p>
              <p>Chủ TK: {contact.bank.holder}</p>
            </div>
          </section>
        </div>

        <Separator className="my-6 bg-neutral-700" />

        <p className="text-center text-sm text-neutral-500">
          &copy; {new Date().getFullYear()} ShopAcc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
