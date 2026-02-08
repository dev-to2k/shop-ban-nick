'use client';

import { Button } from '../ui/button';
import { Card, CardContent, CardTitle, CardDescription } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { api, getAssetUrl, queryKeys } from '../../api';
import { AUTO_ANIMATE_CONFIG } from '../../config';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Gamepad2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { CardImage } from '../ui/card-image';

function GameThumb({
  name,
  src,
  compact,
}: {
  name: string;
  src?: string | null;
  compact?: boolean;
}) {
  return (
    <CardImage
      src={src ?? ''}
      alt={`${name} - thumbnail`}
      wrapperClassName={`relative w-full aspect-4/3 overflow-hidden bg-card rounded-t-xl shrink-0 flex items-center justify-center ${compact ? 'min-h-28' : 'min-h-40'}`}
      imageClassName="object-cover object-center group-hover:scale-105 transition-transform"
      sizes={compact ? '(max-width: 30em) 50vw, (max-width: 48em) 33vw, 25vw' : '(max-width: 30em) 50vw, (max-width: 48em) 25vw, (max-width: 62em) 20vw, 20vw'}
      lazy={false}
      unoptimized
      fallback={<Gamepad2 className="h-12 w-12 text-muted-foreground shrink-0" />}
    />
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
          ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4'
          : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4'
      }
    >
      {games.map(
        (game: {
          id: string;
          name: string;
          slug: string;
          thumbnail?: string | null;
          description?: string;
          _count?: { accounts: number };
        }) => (
          <Link key={game.id} href={`/games/${game.slug}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer flex flex-col h-full group">
              <GameThumb
                name={game.name}
                src={getAssetUrl(game.thumbnail)}
                compact={isPreview}
              />
              <CardContent className="p-3 flex flex-col flex-1">
                <CardTitle className="font-semibold text-sm line-clamp-1">
                  {game.name}
                </CardTitle>
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
        ),
      )}
    </div>
  );

  const skeleton = (
    <div
      className={
        isPreview
          ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4'
          : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4'
      }
    >
      {Array.from({ length: isPreview ? 6 : 10 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-3 sm:p-4">
            <Skeleton
              className={`aspect-4/3 w-full mb-3 ${isPreview ? 'min-h-28' : 'min-h-40'}`}
            />
            <Skeleton className="h-4 w-3/4" />
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
