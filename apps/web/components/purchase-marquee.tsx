'use client';

import { useState, useEffect } from 'react';
import Marquee from 'react-fast-marquee';
import { ShoppingBag, History } from 'lucide-react';

const FAKE_NAMES = ['Anh Tuấn', 'Chị Hương', 'Minh Đức', 'Thu Hà', 'Hoàng Nam', 'Lan Anh', 'Văn Khoa', 'Ngọc Trinh', 'Đức Anh', 'Thanh Mai', 'Quang Huy', 'Phương Linh', 'Tuấn Kiệt', 'Hồng Nhung', 'Bảo Minh'];
const FAKE_GAMES = ['Valorant', 'PUBG Mobile', 'Free Fire', 'Genshin Impact', 'Liên Quân Mobile', 'CrossFire'];
const FAKE_TIMES = ['2 phút trước', '5 phút trước', '12 phút trước', '18 phút trước', '25 phút trước', '32 phút trước', '45 phút trước', '1 giờ trước'];
const FAKE_PRICES = [89000, 120000, 150000, 199000, 250000, 299000, 350000, 450000, 520000, 680000];

type Item = { name: string; game: string; time: string; price: number };

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function formatPrice(n: number) {
  return new Intl.NumberFormat('vi-VN').format(n) + 'đ';
}

function buildItems(count: number, shuffled: boolean): Item[] {
  const items: Item[] = [];
  for (let i = 0; i < count; i++) {
    items.push({
      name: FAKE_NAMES[i % FAKE_NAMES.length],
      game: FAKE_GAMES[i % FAKE_GAMES.length],
      time: FAKE_TIMES[i % FAKE_TIMES.length],
      price: FAKE_PRICES[i % FAKE_PRICES.length],
    });
  }
  return shuffled ? shuffle(items) : items;
}

const INITIAL_ITEMS = buildItems(12, false);

type SectionVariant = 'white' | 'slate';

export function PurchaseMarquee({ sectionVariant = 'slate' }: { sectionVariant?: SectionVariant } = {}) {
  const [items, setItems] = useState<Item[]>(INITIAL_ITEMS);

  useEffect(() => {
    setItems(buildItems(12, true));
  }, []);

  const sectionCls = sectionVariant === 'white' ? 'py-8 overflow-hidden' : 'py-8 overflow-hidden bg-section-alt';

  return (
    <section className={sectionCls}>
      <div className="flex flex-col items-center gap-2 mb-4">
        <History className="h-5 w-5 text-muted-foreground" aria-hidden />
        <p className="text-sm font-medium text-muted-foreground">Giao dịch mẫu</p>
      </div>
      <Marquee speed={48} gradient={false} className="[&_.rfm-child]:!flex [&_.rfm-child]:gap-6">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3 shrink-0 rounded-lg border bg-background px-4 py-2.5 shadow-sm mr-6"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <ShoppingBag className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-xs text-muted-foreground">
                Mua acc <span className="font-medium text-foreground">{item.game}</span> · {item.time}
              </p>
              <p className="text-xs font-semibold text-primary mt-0.5 tabular-nums">{formatPrice(item.price)}</p>
            </div>
          </div>
        ))}
      </Marquee>
    </section>
  );
}
