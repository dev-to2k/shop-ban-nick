'use client';

import { Button } from '@shop-ban-nick/shared-web';
import { useBannerSection } from '../hooks';

export function BannerDots() {
  const { banners, activeIndex, emblaApi } = useBannerSection();
  if (banners.length <= 1) return null;
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5">
      {banners.map((b, i) => (
        <Button
          key={b.promo ? `promo-${i}` : b.href + i}
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => emblaApi?.scrollTo(i)}
          aria-label={`Go to slide ${i + 1}`}
          className={`!h-2 !min-h-0 !w-2 !min-w-0 rounded-full transition-all duration-300 p-0 ${
            i === activeIndex ? '!w-6 bg-white hover:bg-white' : 'bg-white/40 hover:bg-white/60'
          }`}
        />
      ))}
    </div>
  );
}
