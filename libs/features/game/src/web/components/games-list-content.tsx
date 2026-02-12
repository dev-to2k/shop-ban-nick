'use client';

import { useAutoAnimate } from '@formkit/auto-animate/react';
import { ArrowRight, Gamepad2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  getAssetUrl,
  AUTO_ANIMATE_CONFIG,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardImage,
  CardTitle,
} from '@shop-ban-nick/shared-web';
import { useGamesSection } from '../hooks';
import type { GameWithCount } from '../types';

function getRibbon(game: GameWithCount) {
  const slug = game.slug;
  const count = game._count?.accounts ?? 0;
  if (['lien-quan-mobile', 'free-fire'].includes(slug))
    return { text: 'Best Seller', variant: 'warning' as const };
  if (['genshin-impact', 'pubg-mobile'].includes(slug))
    return { text: 'Hot', variant: 'destructive' as const };
  if (count > 50) return { text: 'Phổ biến', variant: 'default' as const };
  return null;
}

export function GamesListContent() {
  const { games, variant, sectionVariant } = useGamesSection();
  const [mounted, setMounted] = useState(false);
  const [gridRef] = useAutoAnimate<HTMLDivElement>(AUTO_ANIMATE_CONFIG);
  const sectionCls = sectionVariant === 'white' ? 'py-16' : 'py-16 bg-section-alt';
  const isPreview = variant === 'preview';

  useEffect(() => setMounted(true), []);

  if (games.length === 0) {
    return (
      <section className={sectionCls}>
        <div className="container-narrow">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="text-fluid-section font-bold">Game đang bán</h2>
            <Link href="/games">
              <Button variant="ghost">Xem tất cả <ArrowRight className="ml-1 h-4 w-4" /></Button>
            </Link>
          </div>
          <div className="text-center py-16 sm:py-20 text-muted-foreground">
            <Gamepad2 className="h-12 w-12 mx-auto mb-4" />
            <p>{isPreview ? 'Chưa có game nào.' : 'Chưa có game nào. Vui lòng quay lại sau!'}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={sectionCls}>
      <div className="container-narrow">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h2 className="text-fluid-section font-bold">Game đang bán</h2>
          <Link href="/games">
            <Button variant="ghost">Xem tất cả <ArrowRight className="ml-1 h-4 w-4" /></Button>
          </Link>
        </div>
        <div
          ref={mounted ? gridRef : undefined}
          {...(mounted ? { 'data-auto-animate': true } : {})}
          className={
            isPreview
              ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4'
              : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4'
          }
        >
          {games.map((game) => {
            const ribbon = getRibbon(game);
            return (
            <Link key={game.id} href={`/games/${game.slug}`}>
              <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full group">
                <CardImage
                  src={getAssetUrl(game.thumbnail) ?? ''}
                  alt={`${game.name} - thumbnail`}
                  wrapperClassName={`relative w-full aspect-4/3 overflow-hidden bg-card rounded-t-xl shrink-0 flex items-center justify-center ${isPreview ? 'min-h-28' : 'min-h-40'}`}
                  imageClassName="object-cover object-center group-hover:scale-105 transition-transform"
                  sizes={isPreview ? '(max-width: 30em) 50vw, (max-width: 48em) 33vw, 25vw' : '(max-width: 30em) 50vw, (max-width: 48em) 25vw, (max-width: 62em) 20vw, 20vw'}
                  lazy={false}
                  unoptimized
                  fallback={<Gamepad2 className="h-12 w-12 text-muted-foreground shrink-0" />}
                >
                  {ribbon && (
                    <Badge variant={ribbon.variant} className="absolute top-2 left-2 z-10 shadow-md">
                      {ribbon.text}
                    </Badge>
                  )}
                </CardImage>
                <CardContent className="p-3 flex flex-col flex-1">
                  <CardTitle className="font-semibold text-sm line-clamp-1">{game.name}</CardTitle>
                  <CardDescription className="text-xs mt-1 shrink-0">
                    {game._count?.accounts ?? 0} acc có sẵn
                  </CardDescription>
                  {!isPreview && (
                    <CardDescription className="text-xs mt-2 line-clamp-2 h-8">
                      {game.description || ''}
                    </CardDescription>
                  )}
                </CardContent>
              </Card>
            </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
