'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, ImageIcon } from 'lucide-react';
import { CarouselNavButton, carouselNavButtonPositions } from './carousel-nav-button';
import { Button } from './button';
import { api, getAssetUrl, queryKeys } from '@shared/api';

interface BannerSlide {
  image?: string;
  title: string;
  subtitle: string;
  href: string;
  gradient: string;
  promo?: boolean;
}

function toSlide(item: { image: string; title: string; subtitle: string; href: string; gradient: string; promo?: boolean }): BannerSlide {
  return {
    ...item,
    image: getAssetUrl(item.image) || item.image,
  };
}

/* ── Dot indicator ─────────────────────────────── */
function DotButton({ active, onClick, index }: { active: boolean; onClick: () => void; index: number }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={onClick}
      aria-label={`Go to slide ${index + 1}`}
      className={`!h-2 !min-h-0 !w-2 !min-w-0 rounded-full transition-all duration-300 p-0 ${
        active ? '!w-6 bg-white hover:bg-white' : 'bg-white/40 hover:bg-white/60'
      }`}
    />
  );
}

/* ── Slide content ─────────────────────────────── */
function SlideContent({ banner, index }: { banner: BannerSlide; index: number }) {
  const [imgError, setImgError] = useState(false);
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
            className="absolute inset-0 flex flex-col justify-end max-w-lg drop-shadow"
            style={{
              padding: 'clamp(1rem, 4vw, 3rem)',
              gap: 'clamp(0.25rem, 1vw, 0.75rem)',
            }}
          >
            <h2 className="text-fluid-hero font-bold text-white drop-shadow-lg tracking-tight">
              {banner.title}
            </h2>
            <p
              className="text-white/80 max-w-lg drop-shadow"
              style={{ fontSize: 'clamp(0.75rem, 1.5vw + 0.5rem, 1rem)' }}
            >
              {banner.subtitle}
            </p>
            <span
              className="inline-flex w-fit items-center gap-1.5 bg-white/15 backdrop-blur-md text-white rounded-full font-medium border border-white/20 hover:bg-white/25 transition-colors"
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

/* ── Main slider ───────────────────────────────── */
export function BannerSlider() {
  const { data: list = [], isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.banners.all,
    queryFn: () => api.getBanners(),
    staleTime: 60_000,
    retry: 2,
  });

  const banners: BannerSlide[] = Array.isArray(list) ? list.map(toSlide) : [];

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: banners.length > 1,
      align: 'start',
      // @ts-expect-error embla type may not include 'trim'
      containScroll: 'trim',
      skipSnaps: false,
      dragFree: false,
    },
    [Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })]
  );
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setActiveIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi]);

  if (isError) {
    return (
      <div className="relative group overflow-hidden">
        <div className="overflow-hidden">
          <div className="flex">
            <div className="flex-[0_0_100%] min-w-0 relative">
              <div className="relative w-full overflow-hidden aspect-[21/9] bg-muted/30 flex flex-col items-center justify-center gap-3">
                <span className="text-sm text-muted-foreground">Không tải được banner</span>
                <Button variant="outline" size="sm" onClick={() => refetch()}>Thử lại</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || banners.length === 0) {
    return (
      <div className="relative group overflow-hidden">
        <div className="overflow-hidden">
          <div className="flex">
            <div className="flex-[0_0_100%] min-w-0 relative">
              <div className="relative w-full overflow-hidden aspect-[21/9]">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-muted to-primary/10 blur-md scale-110" aria-hidden />
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <span className="text-white font-medium tracking-wide flex items-center gap-0.5">
                    Loading
                    <span className="inline-flex gap-0.5" aria-hidden>
                      <span className="animate-loading-dot">.</span>
                      <span className="animate-loading-dot [animation-delay:0.2s]">.</span>
                      <span className="animate-loading-dot [animation-delay:0.4s]">.</span>
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group overflow-hidden">
      <div className="overflow-hidden w-full" ref={emblaRef}>
        <div className="flex">
          {banners.map((b, i) => (
            <SlideContent key={b.promo ? 'promo' : b.href + i} banner={b} index={i} />
          ))}
        </div>
      </div>

      <CarouselNavButton dir="prev" onClick={scrollPrev} className={carouselNavButtonPositions.banner.prev} />
      <CarouselNavButton dir="next" onClick={scrollNext} className={carouselNavButtonPositions.banner.next} />

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5">
        {banners.map((b, i) => (
          <DotButton key={b.promo ? `promo-${i}` : b.href + i} active={i === activeIndex} index={i} onClick={() => scrollTo(i)} />
        ))}
      </div>
    </div>
  );
}
