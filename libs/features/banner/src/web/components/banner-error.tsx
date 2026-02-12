'use client';

import { RefreshCw } from 'lucide-react';
import { Button } from '@shop-ban-nick/shared-web';
import { useBannerSection } from '../hooks';

export function BannerError() {
  const { refetch } = useBannerSection();
  return (
    <div className="relative w-full overflow-hidden aspect-[21/9] bg-muted/30 flex flex-col items-center justify-center gap-3">
      <span className="text-sm text-muted-foreground">Không tải được banner</span>
      <Button variant="outline" size="sm" onClick={() => refetch()}>
        <RefreshCw className="h-4 w-4" />
        Thử lại
      </Button>
    </div>
  );
}
