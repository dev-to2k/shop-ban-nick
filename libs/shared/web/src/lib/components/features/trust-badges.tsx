'use client';

import { Clock, RefreshCcw, ShieldCheck, Wallet } from 'lucide-react';

const TRUST_ITEMS = [
  {
    icon: ShieldCheck,
    title: 'Acc chính chủ 100%',
    desc: 'Đảm bảo thông tin chính xác, không trùng lặp.',
  },
  {
    icon: Wallet,
    title: 'Thanh toán an toàn',
    desc: 'Hỗ trợ chuyển khoản NH, ví điện tử 24/7.',
  },
  {
    icon: Clock,
    title: 'Giao acc siêu tốc',
    desc: 'Nhận thông tin trong 5 phút sau thanh toán.',
  },
  {
    icon: RefreshCcw,
    title: 'Hoàn tiền 24h',
    desc: 'Cam kết hoàn tiền nếu acc lỗi trong 24 giờ.',
  },
];

type SectionVariant = 'white' | 'slate';

export function TrustBadges({
  sectionVariant = 'white',
}: {
  sectionVariant?: SectionVariant;
}) {
  const sectionCls =
    sectionVariant === 'white' ? 'py-10' : 'py-10 bg-section-alt';

  return (
    <section className={sectionCls} aria-label="Cam kết uy tín">
      <div className="container-narrow">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {TRUST_ITEMS.map((item) => (
            <div
              key={item.title}
              className="flex flex-col items-center text-center p-4 rounded-xl bg-background border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-3">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
