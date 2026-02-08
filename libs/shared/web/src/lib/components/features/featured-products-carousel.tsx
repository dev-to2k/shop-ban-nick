'use client';

import { ProductsCarousel } from './products-carousel';

type SectionVariant = 'white' | 'slate';

export function FeaturedProductsCarousel({ sectionVariant }: { sectionVariant?: SectionVariant } = {}) {
  return (
    <ProductsCarousel
      mode="multi"
      title="Acc nổi bật"
      linkHref="/games"
      sort={{ sortBy: 'createdAt', sortOrder: 'desc' }}
      limitPerGame={4}
      maxGames={6}
      autoplay={true}
      sectionVariant={sectionVariant}
    />
  );
}
