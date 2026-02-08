import { ProductProvider } from '@/lib/product-context';
import { GameHeader, ProductFilters, ProductGrid } from '@/components/product';

export default async function GameAccountsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <ProductProvider slug={slug}>
      <div className="container mx-auto px-4 py-8">
        <GameHeader />
        <ProductFilters />
        <ProductGrid />
      </div>
    </ProductProvider>
  );
}
