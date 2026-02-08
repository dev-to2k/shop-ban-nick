'use client';

import { Suspense, useEffect } from 'react';
import { useBreadcrumb, GamesMall } from '@shop-ban-nick/shared-web';

export function GamesPage() {
  const { setItems: setBreadcrumb } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumb([{ label: 'Trang chủ', href: '/' }, { label: 'Danh sách game' }]);
    return () => setBreadcrumb([]);
  }, [setBreadcrumb]);

  return (
    <div className="container-narrow py-6 sm:py-8">
      <Suspense fallback={<div className="min-h-[200px] animate-pulse rounded-lg bg-muted" />}>
        <GamesMall />
      </Suspense>
    </div>
  );
}
