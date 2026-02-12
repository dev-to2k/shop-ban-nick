'use client';

import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Gamepad2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api, getAssetUrl, queryKeys } from '@shared/api';
import { AUTO_ANIMATE_CONFIG } from '@shared/config';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardTitle } from './card';
import { CardImage } from './card-image';
import { Skeleton } from './skeleton';

import { Badge } from './badge';

function getRibbon(game: { slug: string; _count?: { accounts: number } }) {
  const slug = game.slug;
  const count = game._count?.accounts ?? 0;

  if (['lien-quan-mobile', 'free-fire'].includes(slug))
    return { text: 'Best Seller', variant: 'warning' as const };
  if (['genshin-impact', 'pubg-mobile'].includes(slug))
    return { text: 'Hot', variant: 'destructive' as const };
  if (['roblox', 'bloxfruits'].includes(slug))
    return { text: 'Mới', variant: 'success' as const };
  if (count > 50) return { text: 'Phổ biến', variant: 'default' as const };
  return null;
}

function GameThumb({
  name,
  src,
  compact,
  ribbon,
}: {
  name: string;
  src?: string | null;
  compact?: boolean;
  ribbon?: {
    text: string;
    variant:
      | 'default'
      | 'secondary'
      | 'destructive'
      | 'outline'
      | 'success'
      | 'warning';
  } | null;
}) {
  return (
    <CardImage
      src={src ?? ''}
      alt={`${name} - thumbnail`}
      wrapperClassName={`relative w-full aspect-4/3 overflow-hidden bg-card rounded-t-xl shrink-0 flex items-center justify-center ${compact ? 'min-h-28' : 'min-h-40'}`}
      imageClassName="object-cover object-center group-hover:scale-105 transition-transform"
      sizes={
        compact
          ? '(max-width: 30em) 50vw, (max-width: 48em) 33vw, 25vw'
          : '(max-width: 30em) 50vw, (max-width: 48em) 25vw, (max-width: 62em) 20vw, 20vw'
      }
      lazy={false}
      unoptimized
      fallback={
        <Gamepad2 className="h-12 w-12 text-muted-foreground shrink-0" />
      }
    >
      {ribbon && (
        <Badge
          variant={ribbon.variant}
          className="absolute top-2 left-2 z-10 shadow-md"
        >
          {ribbon.text}
        </Badge>
      )}
    </CardImage>
  );
}

type GamesListVariant = 'preview' | 'full';
type SectionVariant = 'white' | 'slate';

const SECTION_SLATE = 'py-16 bg-section-alt';
const SECTION_WHITE = 'py-16';

export function GamesList({
  variant = 'full',
  sectionVariant = 'slate',
}: {
  variant?: GamesListVariant;
  sectionVariant?: SectionVariant;
}) {
  const sectionCls = sectionVariant === 'white' ? SECTION_WHITE : SECTION_SLATE;
  const [mounted, setMounted] = useState(false);
  const [gridRef] = useAutoAnimate<HTMLDivElement>(AUTO_ANIMATE_CONFIG);
  const { data: games = [], isLoading } = useQuery({
    queryKey: queryKeys.games.all,
    queryFn: () => api.getGames(),
  });

  useEffect(() => setMounted(true), []);
  const isPreview = variant === 'preview';

  const grid = (
    <div
      ref={mounted ? gridRef : undefined}
      {...(mounted ? { 'data-auto-animate': true } : {})}
      className={
        isPreview
          ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
          : 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4'
      }
    >
      {games.map((game) => (
        <Link
          key={game.id}
          href={`/games/${game.slug}`}
          className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
        >
          <Card className="hover:shadow-lg hover:-translate-y-1 active:scale-[0.99] transition-all duration-300 cursor-pointer flex flex-col h-full min-h-[280px] group">
            <GameThumb
              name={game.name}
              src={getAssetUrl(game.thumbnail)}
              compact={isPreview}
              ribbon={getRibbon(game)}
            />
            <CardContent className="p-5 flex flex-col flex-1 gap-4">
              <div className="flex flex-col gap-2 h-10 shrink-0">
                <CardTitle className="text-base font-semibold leading-tight line-clamp-1">
                  {game.name}
                </CardTitle>
                <CardDescription className="text-sm shrink-0">
                  {game._count?.accounts ?? 0} acc có sẵn
                </CardDescription>
              </div>
              {!isPreview && (
                <CardDescription className="text-sm line-clamp-2 min-h-10 shrink-0">
                  {game.description || ''}
                </CardDescription>
              )}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );

  const skeleton = (
    <div
      className={
        isPreview
          ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
          : 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4'
      }
    >
      {Array.from({ length: isPreview ? 6 : 10 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-5 flex flex-col flex-1 gap-4">
            <Skeleton
              className={`aspect-4/3 w-full ${isPreview ? 'min-h-28' : 'min-h-40'}`}
            />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const empty = (
    <div className="text-center py-16 sm:py-20 text-muted-foreground">
      <Gamepad2 className="h-12 w-12 mx-auto mb-4" />
      <p>
        {isPreview
          ? 'Chưa có game nào.'
          : 'Chưa có game nào. Vui lòng quay lại sau!'}
      </p>
    </div>
  );

  if (isLoading) {
    if (isPreview) {
      return (
        <section className={sectionCls}>
          <div className="container-narrow">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <h2 className="text-fluid-section font-bold">Game đang bán</h2>
              <Link href="/games">
                <Button variant="ghost">
                  Xem tất cả <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
            {skeleton}
          </div>
        </section>
      );
    }
    return skeleton;
  }

  if (games.length === 0) {
    if (isPreview) {
      return (
        <section className={sectionCls}>
          <div className="container-narrow">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <h2 className="text-fluid-section font-bold">Game đang bán</h2>
              <Link href="/games">
                <Button variant="ghost">
                  Xem tất cả <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
            {empty}
          </div>
        </section>
      );
    }
    return empty;
  }

  if (isPreview) {
    return (
      <section className={sectionCls}>
        <div className="container-narrow">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="text-fluid-section font-bold">Game đang bán</h2>
            <Link href="/games">
              <Button variant="ghost">
                Xem tất cả <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
          {grid}
        </div>
      </section>
    );
  }

  return grid;
}
