import { ProductProvider } from '@/lib/product-context';
import { GameHeader, ProductFilters, ProductGrid } from '@/components/product';

export default async function GameAccountsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
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
