'use client';

import { ProductProvider, GameHeader, ProductFilters, ProductGrid } from '@shop-ban-nick/shared-web';

export function GameAccountsPage({ slug }: { slug: string }) {
  return (
    <ProductProvider slug={slug}>
      <div className="container-narrow py-6 sm:py-8 min-w-0 overflow-x-hidden">
        <GameHeader />
        <ProductFilters />
        <ProductGrid />
      </div>
    </ProductProvider>
  );
}
