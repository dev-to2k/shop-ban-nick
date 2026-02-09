'use client';

import { formatPrice } from '@shop-ban-nick/shared-utils';
import { useQuery } from '@tanstack/react-query';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Clock, Flame } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { api, getAssetUrl, queryKeys } from '../../api';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { CardImage } from '../ui/card-image';
import { Skeleton } from '../ui/skeleton';

/**
 * FlashSale Component
 * - Displays "hot deal" accounts with countdown timer
 * - Shows stock progress bar to create urgency
 * - Auto-advances carousel
 */

type SectionVariant = 'white' | 'slate';

// Countdown logic
function useCountdown(endTime: Date) {
  const [timeLeft, setTimeLeft] = useState(() => {
    const diff = endTime.getTime() - Date.now();
    return Math.max(0, Math.floor(diff / 1000));
  });

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      const diff = endTime.getTime() - Date.now();
      setTimeLeft(Math.max(0, Math.floor(diff / 1000)));
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime, timeLeft]);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return { hours, minutes, seconds, isExpired: timeLeft <= 0 };
}

function padZero(n: number): string {
  return n.toString().padStart(2, '0');
}

// Stock progress bar
function StockBar({ sold, total }: { sold: number; total: number }) {
  const percent = Math.min(100, Math.round((sold / total) * 100));
  const isHot = percent >= 70;

  return (
    <div className="mt-2">
      <div className="flex justify-between text-xs mb-1">
        <span
          className={
            isHot ? 'text-destructive font-medium' : 'text-muted-foreground'
          }
        >
          {isHot ? '🔥 Sắp hết!' : `Đã bán ${sold}/${total}`}
        </span>
        <span className="text-muted-foreground">{percent}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${isHot ? 'bg-destructive' : 'bg-primary'}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

// Flash sale end time: midnight tonight (or next day if past noon)
function getFlashSaleEndTime(): Date {
  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  if (now.getHours() >= 20) {
    end.setDate(end.getDate() + 1);
  }
  return end;
}

export function FlashSale({
  sectionVariant = 'slate',
}: {
  sectionVariant?: SectionVariant;
}) {
  const sectionCls =
    sectionVariant === 'white' ? 'py-12' : 'py-12 bg-section-alt';

  const { data: games } = useQuery({
    queryKey: queryKeys.games.all,
    queryFn: () => api.getGames(),
    staleTime: 60_000,
  });

  const featuredGame = games?.find((g) => g.slug === 'free-fire') || games?.[0];

  const { data: accountsData, isLoading } = useQuery({
    queryKey: queryKeys.accounts.byGame(featuredGame?.slug ?? '', {
      limit: '8',
    }),
    queryFn: () =>
      api.getAccountsByGame(featuredGame?.slug ?? '', { limit: '8' }),
    enabled: !!featuredGame,
    staleTime: 60_000,
  });

  const accounts = (accountsData?.data ?? []).map((acc: any) => ({
    ...acc,
    // Ensure we have a game object for display
    game: acc.game ?? { name: featuredGame?.name ?? 'Game' },
    originalPrice: acc.originalPrice ?? acc.price * 1.2, // Fake original price if missing
  }));

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: accounts.length > 3,
    align: 'start',
    slidesToScroll: 1,
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const [endTime] = useState(() => getFlashSaleEndTime());
  const { hours, minutes, seconds, isExpired } = useCountdown(endTime);

  if (isLoading || !featuredGame) {
    return (
      <section className={sectionCls}>
        <div className="container-narrow">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-8 w-32" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-3">
                  <Skeleton className="aspect-4/3 w-full mb-3" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (accounts.length === 0 || isExpired) {
    return null; // Hide if no deals or expired
  }

  return (
    <section className={sectionCls} aria-labelledby="flash-sale-heading">
      <div className="container-narrow">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <Flame className="h-5 w-5" />
            </div>
            <h2
              id="flash-sale-heading"
              className="text-fluid-section font-bold"
            >
              Flash Sale
            </h2>
            <Badge variant="destructive" className="animate-pulse">
              HOT
            </Badge>
          </div>

          {/* Countdown */}
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Kết thúc sau:</span>
            <div className="flex gap-1 font-mono font-bold">
              <span className="bg-foreground text-background px-2 py-1 rounded">
                {padZero(hours)}
              </span>
              <span>:</span>
              <span className="bg-foreground text-background px-2 py-1 rounded">
                {padZero(minutes)}
              </span>
              <span>:</span>
              <span className="bg-foreground text-background px-2 py-1 rounded">
                {padZero(seconds)}
              </span>
            </div>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4">
              {accounts.map((acc) => {
                const soldCount = Math.floor(Math.random() * 8) + 2; // Simulated
                const totalCount = 10;
                return (
                  <div
                    key={acc.id}
                    className="flex-[0_0_calc(50%-0.5rem)] md:flex-[0_0_calc(33.333%-0.75rem)] min-w-0"
                  >
                    <Link href={`/games/${acc.game?.slug}/${acc.id}`}>
                      <Card className="group hover:shadow-lg transition-shadow h-full">
                        <div className="relative">
                          <CardImage
                            src={getAssetUrl(acc.images?.[0]) ?? ''}
                            alt={acc.title}
                            wrapperClassName="aspect-4/3 rounded-t-xl overflow-hidden"
                            imageClassName="object-cover group-hover:scale-105 transition-transform"
                            sizes="(max-width: 768px) 50vw, 33vw"
                          />
                          {/* Discount badge */}
                          {acc.originalPrice &&
                            acc.originalPrice > acc.price && (
                              <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">
                                -
                                {Math.round(
                                  (1 - acc.price / acc.originalPrice) * 100,
                                )}
                                %
                              </Badge>
                            )}
                        </div>
                        <CardContent className="p-3">
                          <p className="font-medium text-sm line-clamp-1 mb-1">
                            {acc.title}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                            {acc.game?.name}
                          </p>
                          <div className="flex items-baseline gap-2">
                            <span className="text-primary font-bold">
                              {formatPrice(acc.price)}
                            </span>
                            {acc.originalPrice &&
                              acc.originalPrice > acc.price && (
                                <span className="text-xs text-muted-foreground line-through">
                                  {formatPrice(acc.originalPrice)}
                                </span>
                              )}
                          </div>
                          <StockBar sold={soldCount} total={totalCount} />
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          {accounts.length > 3 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 h-8 w-8 rounded-full bg-background shadow-md hidden md:flex"
                onClick={scrollPrev}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 h-8 w-8 rounded-full bg-background shadow-md hidden md:flex"
                onClick={scrollNext}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
