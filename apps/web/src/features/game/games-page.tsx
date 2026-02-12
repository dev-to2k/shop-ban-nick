import { Suspense } from 'react';
import { GamesMall } from '@shared/components';

export function GamesPage() {
  return (
    <div className="container-narrow py-6 sm:py-8">
      <Suspense fallback={<div className="min-h-[200px] animate-pulse rounded-lg bg-muted" />}>
        <GamesMall />
      </Suspense>
    </div>
  );
}
