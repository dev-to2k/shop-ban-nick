'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { Gamepad2, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { BannerSlider } from '@/components/banner-slider';
import { api } from '@/lib/api';
import { queryKeys } from '@/lib/query-keys';
import { formatPrice } from '@shop-ban-nick/shared-utils';

const GAME_THUMB_SLUGS = ['lien-quan-mobile', 'free-fire', 'crossfire', 'genshin-impact', 'pubg-mobile', 'valorant'];

function GameThumb({ game }: { game: { id: string; slug: string; name: string; thumbnail?: string | null } }) {
  const [imgError, setImgError] = useState(false);
  const thumbSrc = game.thumbnail || (GAME_THUMB_SLUGS.includes(game.slug) ? `/games/${game.slug}.png` : null);
  const onError = useCallback(() => setImgError(true), []);

  if (!thumbSrc || imgError) {
    return (
      <div className="h-36 bg-muted rounded-t-xl flex items-center justify-center shrink-0">
        <Gamepad2 className="h-12 w-12 text-muted-foreground" />
      </div>
    );
  }
  return (
    <div className="h-36 bg-muted rounded-t-xl flex items-center justify-center overflow-hidden shrink-0 relative">
      <Image
        src={thumbSrc}
        alt={game.name}
        fill
        className="object-cover group-hover:scale-105 transition-transform"
        sizes="(max-width: 768px) 50vw, 25vw"
        unoptimized={thumbSrc.startsWith('/games/')}
        onError={onError}
      />
    </div>
  );
}

export default function HomePage() {
  const { data: games = [], isLoading } = useQuery({
    queryKey: queryKeys.games.all,
    queryFn: () => api.getGames(),
  });

  return (
    <div>
      {/* Banner Slider — full width */}
      <section>
        <BannerSlider />
      </section>

      {/* Tagline */}
      <section className="py-8 text-center">
        <Badge variant="secondary" className="mb-3">Uy tín #1 Việt Nam</Badge>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">
          Mua Acc Game <span className="text-primary">Giá Tốt Nhất</span>
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Hàng ngàn acc game chất lượng, giao dịch tức thì.
        </p>
      </section>

      {/* Features */}
      <section className="py-16 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Zap, title: 'Giao dịch tức thì', desc: 'Nhận acc ngay sau khi thanh toán được xác nhận' },
            { icon: ShieldCheck, title: 'Bảo hành uy tín', desc: 'Cam kết hoàn tiền nếu acc lỗi trong 24h' },
            { icon: Gamepad2, title: 'Đa dạng game', desc: 'Liên Quân, Free Fire, PUBG, Genshin và nhiều hơn' },
          ].map((f) => (
            <Card key={f.title}>
              <CardHeader>
                <f.icon className="h-8 w-8 text-primary mb-2" />
                <CardTitle>{f.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Games */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Game đang bán</h2>
            <Link href="/games">
              <Button variant="ghost">Xem tất cả <ArrowRight className="ml-1 h-4 w-4" /></Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}><CardContent className="p-4"><Skeleton className="h-32 w-full mb-3" /><Skeleton className="h-4 w-3/4" /></CardContent></Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {games.map((game: any) => (
                <Link key={game.id} href={`/games/${game.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer group flex flex-col h-full">
                    <GameThumb game={game} />
                    {/* Info - fixed layout */}
                    <CardContent className="p-3 flex flex-col flex-1">
                      <h3 className="font-semibold text-sm line-clamp-1">{game.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {game._count?.accounts || 0} acc có sẵn
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
