'use client';

import { useEffect } from 'react';
import { useBreadcrumb } from '@/lib/breadcrumb-context';
import { GamesMall } from '@/components/games-mall';

export default function GamesPage() {
  const { setItems: setBreadcrumb } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumb([{ label: 'Trang chủ', href: '/' }, { label: 'Danh sách game' }]);
    return () => setBreadcrumb([]);
  }, [setBreadcrumb]);

  return (
    <div className="container-narrow py-6 sm:py-8">
      <GamesMall />
    </div>
  );
}
