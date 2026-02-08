'use client';

import { useIsMutating } from '@tanstack/react-query';
import { Spinner } from '@/components/ui/spinner';

export function GlobalMutationLoading() {
  const isMutating = useIsMutating();

  if (isMutating === 0) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-[2px]"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-3 rounded-lg bg-card p-6 shadow-lg border">
        <Spinner className="size-10 text-primary" />
        <span className="text-sm font-medium text-muted-foreground">Đang xử lý...</span>
      </div>
    </div>
  );
}
