'use client';

import { ArrowRight, Gamepad2 } from 'lucide-react';
import Link from 'next/link';
import { Button, Card, CardContent, Skeleton } from '@shop-ban-nick/shared-web';
import { useGamesSection } from '../hooks';

export function GamesLoading() {
  const { variant, sectionVariant } = useGamesSection();
  const sectionCls = sectionVariant === 'white' ? 'py-16' : 'py-16 bg-section-alt';
  const isPreview = variant === 'preview';
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
      </div>
    </section>
  );
}
