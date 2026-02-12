'use client';

import { RefreshCw } from 'lucide-react';
import { Button } from '@shop-ban-nick/shared-web';
import { useGamesSection } from '../hooks';

export function GamesError() {
  const { refetch, sectionVariant } = useGamesSection();
  const sectionCls = sectionVariant === 'white' ? 'py-16' : 'py-16 bg-section-alt';
  return (
    <section className={sectionCls}>
      <div className="container-narrow flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
        <p className="text-sm">Không tải được danh sách game</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4" />
          Thử lại
        </Button>
      </div>
    </section>
  );
}
