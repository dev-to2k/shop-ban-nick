'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useBannerSection } from '../hooks';
import type { BannerSlide } from '../types';

interface BannerSlideItemProps {
  banner: BannerSlide;
  index: number;
}

export function BannerSlideItem({ banner, index }: BannerSlideItemProps) {
  const [imgError, setImgError] = useState(false);
  const { activeIndex } = useBannerSection();
  return (
    <div className="relative shrink-0 w-full min-w-0" style={{ flex: '0 0 100%' }}>
      <Link href={banner.href} className="block">
        <div className="relative w-full overflow-hidden aspect-[21/9]">
          {banner.image && !imgError && (
            <div className="absolute inset-0 [animation:var(--animate-banner-bg-zoom)]">
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                priority={index === 0}
                sizes="100vw"
                unoptimized
                onError={() => setImgError(true)}
                className="object-cover object-center"
              />
            </div>
          )}
          <div className={`absolute inset-0 bg-linear-to-r ${banner.gradient}`} />
          {!banner.promo && <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />}
          <div
            key={`slide-content-${index}-${activeIndex}`}
            className="absolute inset-0 flex flex-col justify-end max-w-lg drop-shadow"
            style={{
              padding: 'clamp(1rem, 4vw, 3rem)',
              gap: 'clamp(0.25rem, 1vw, 0.75rem)',
            }}
          >
            <h2
              className="text-fluid-hero font-bold text-white drop-shadow-lg tracking-tight opacity-0 [animation:var(--animate-banner-text-in)]"
            >
              {banner.title}
            </h2>
            <p
              className="text-white/80 max-w-lg drop-shadow opacity-0 [animation:var(--animate-banner-text-in)] [animation-delay:0.12s]"
              style={{ fontSize: 'clamp(0.75rem, 1.5vw + 0.5rem, 1rem)' }}
            >
              {banner.subtitle}
            </p>
            <span
              className="inline-flex w-fit items-center gap-1.5 bg-white/15 backdrop-blur-md text-white rounded-full font-medium border border-white/20 hover:bg-white/25 transition-colors opacity-0 [animation:var(--animate-banner-text-in)] [animation-delay:0.24s]"
              style={{
                padding: 'clamp(0.375rem, 1vw, 0.5rem) clamp(0.75rem, 2vw, 1rem)',
                fontSize: 'clamp(0.75rem, 1vw + 0.5rem, 0.875rem)',
              }}
            >
              Xem ngay
              <ChevronRight className="h-[1em] w-[1em] shrink-0" />
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
