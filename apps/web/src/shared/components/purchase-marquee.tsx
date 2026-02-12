'use client';

import { CheckCircle2, History, ShoppingBag } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import Marquee from 'react-fast-marquee';

/**
 * Realistic Simulation Logic
 * - Names are masked (e.g., "Nguy***") to feel authentic
 * - Times are relative and update dynamically
 * - Prices vary realistically by game type
 */

const VIETNAM_LAST_NAMES = [
  'Nguyễn',
  'Trần',
  'Lê',
  'Phạm',
  'Hoàng',
  'Huỳnh',
  'Phan',
  'Vũ',
  'Võ',
  'Đặng',
  'Bùi',
  'Đỗ',
  'Hồ',
  'Ngô',
  'Dương',
  'Lý',
];

const GAME_PRICE_MAP: Record<string, { min: number; max: number }> = {
  'Liên Quân Mobile': { min: 150_000, max: 2_500_000 },
  'Free Fire': { min: 80_000, max: 1_200_000 },
  'PUBG Mobile': { min: 120_000, max: 1_800_000 },
  'Genshin Impact': { min: 500_000, max: 5_000_000 },
  Valorant: { min: 200_000, max: 3_000_000 },
  CrossFire: { min: 100_000, max: 800_000 },
};

const GAMES = Object.keys(GAME_PRICE_MAP);

function maskName(lastName: string): string {
  if (lastName.length <= 2) return lastName[0] + '***';
  return lastName.slice(0, 2) + '***';
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomPrice(game: string): number {
  const range = GAME_PRICE_MAP[game] ?? { min: 100_000, max: 500_000 };
  const raw = randomInt(range.min, range.max);
  return Math.round(raw / 10_000) * 10_000; // Round to nearest 10k
}

function formatPrice(n: number): string {
  return new Intl.NumberFormat('vi-VN').format(n) + 'đ';
}

function getRelativeTime(seconds: number): string {
  if (seconds < 60) return 'Vừa xong';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  return `${hours} giờ trước`;
}

type Item = {
  id: string;
  maskedName: string;
  game: string;
  price: number;
  secondsAgo: number;
};

function generateItems(count: number): Item[] {
  const items: Item[] = [];
  for (let i = 0; i < count; i++) {
    const lastName =
      VIETNAM_LAST_NAMES[randomInt(0, VIETNAM_LAST_NAMES.length - 1)];
    const game = GAMES[randomInt(0, GAMES.length - 1)];
    items.push({
      id: `${Date.now()}-${i}-${Math.random().toString(36).slice(2, 7)}`,
      maskedName: maskName(lastName),
      game,
      price: randomPrice(game),
      secondsAgo: randomInt(30, 3600), // 30s to 1h ago
    });
  }
  // Sort by most recent
  return items.sort((a, b) => a.secondsAgo - b.secondsAgo);
}

type SectionVariant = 'white' | 'slate';

export function PurchaseMarquee({
  sectionVariant = 'slate',
}: { sectionVariant?: SectionVariant } = {}) {
  const [items, setItems] = useState<Item[]>(() => generateItems(10));

  // Simulate new purchases coming in periodically
  const addNewPurchase = useCallback(() => {
    setItems((prev) => {
      const newItem = generateItems(1)[0];
      newItem.secondsAgo = randomInt(5, 30); // Very recent
      const updated = [newItem, ...prev.slice(0, 11)]; // Keep max 12 items
      return updated;
    });
  }, []);

  useEffect(() => {
    // Add a new "purchase" every 15-45 seconds for realism
    const interval = setInterval(
      () => {
        addNewPurchase();
      },
      randomInt(15_000, 45_000),
    );

    return () => clearInterval(interval);
  }, [addNewPurchase]);

  // Update times every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setItems((prev) =>
        prev.map((item) => ({ ...item, secondsAgo: item.secondsAgo + 60 })),
      );
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  const sectionCls =
    sectionVariant === 'white'
      ? 'py-8 overflow-hidden'
      : 'py-8 overflow-hidden bg-section-alt';

  return (
    <section className={sectionCls}>
      <div className="flex flex-col items-center gap-2 mb-4">
        <History className="h-5 w-5 text-muted-foreground" aria-hidden />
        <p className="text-sm font-medium text-muted-foreground">
          Giao dịch gần đây
        </p>
      </div>
      <Marquee
        speed={48}
        gradient={false}
        pauseOnHover
        className="[&_.rfm-child]:flex! [&_.rfm-child]:gap-6"
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 shrink-0 rounded-lg border bg-background px-4 py-2.5 shadow-sm mr-6"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <ShoppingBag className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium flex items-center gap-1">
                {item.maskedName}
                <CheckCircle2
                  className="h-3.5 w-3.5 text-emerald-500"
                  aria-label="Verified"
                />
              </p>
              <p className="text-xs text-muted-foreground">
                Mua acc{' '}
                <span className="font-medium text-foreground">{item.game}</span>{' '}
                · {getRelativeTime(item.secondsAgo)}
              </p>
              <p className="text-xs font-semibold text-primary mt-0.5 tabular-nums">
                {formatPrice(item.price)}
              </p>
            </div>
          </div>
        ))}
      </Marquee>
    </section>
  );
}
