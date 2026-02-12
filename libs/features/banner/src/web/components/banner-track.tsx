'use client';

import { useBannerSection } from '../hooks';
import { BannerSlideItem } from './banner-slide-item';

interface BannerTrackProps {
  emblaRef: (el: HTMLDivElement | null) => void;
}

export function BannerTrack({ emblaRef }: BannerTrackProps) {
  const { banners } = useBannerSection();
  return (
    <div className="overflow-hidden w-full" ref={emblaRef}>
      <div className="flex">
        {banners.map((b, i) => (
          <BannerSlideItem key={b.promo ? 'promo' : b.href + i} banner={b} index={i} />
        ))}
      </div>
    </div>
  );
}
