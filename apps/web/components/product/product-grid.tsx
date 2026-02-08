'use client';

import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useEffect } from 'react';
import { AUTO_ANIMATE_CONFIG } from '@/lib/auto-animate-config';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProduct } from '@/lib/product-context';
import { useAccounts } from '@/hooks/use-accounts';
import { ProductCard, ProductCardSkeleton } from './product-card';

function Pagination({ meta, onBeforePageChange }: { meta: any | null; onBeforePageChange?: () => void }) {
  const { page, setPage } = useProduct();

  if (!meta || meta.totalPages <= 1) return null;

  return (
    <div className="flex justify-center gap-2 mt-8">
      <Button
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => {
          onBeforePageChange?.();
          setPage(page - 1);
        }}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />Trước
      </Button>
      <span className="flex items-center text-sm text-muted-foreground">
        Trang {page}/{meta.totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={page >= meta.totalPages}
        onClick={() => {
          onBeforePageChange?.();
          setPage(page + 1);
        }}
      >
        Sau<ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
}

export function ProductGrid() {
  const { slug, page, sortBy, sortOrder, search } = useProduct();
  const { data, isLoading } = useAccounts({ slug, page, sortBy, sortOrder, search });
  const [gridRef, setAutoAnimateEnabled] = useAutoAnimate<HTMLDivElement>(AUTO_ANIMATE_CONFIG);

  const accounts = data?.data ?? [];
  const meta = data?.meta ?? null;

  useEffect(() => {
    const id = requestAnimationFrame(() => setAutoAnimateEnabled(true));
    return () => cancelAnimationFrame(id);
  }, [page, accounts]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i} />)}
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <p>Không tìm thấy acc nào.</p>
      </div>
    );
  }

  return (
    <>
      <div ref={gridRef} data-auto-animate className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 min-w-0">
        {accounts.map((account: any) => (
          <ProductCard
            key={account.id}
            item={{
              id: account.id,
              code: account.code,
              title: account.title,
              price: Number(account.price),
              gameSlug: slug,
              gameName: account.game?.name,
              image: account.images?.[0],
              images: account.images,
              attributes: account.attributes,
              tag: account.tag,
              discount: account.discount,
            }}
            slug={slug}
            variant="card"
          />
        ))}
      </div>
      <Pagination meta={meta} onBeforePageChange={() => setAutoAnimateEnabled(false)} />
    </>
  );
}
