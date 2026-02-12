'use client';

import { useEffect, useMemo, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { BannerSectionContext } from '../context/banner-section-context';
import { useBannersQuery } from '../hooks';
import { useBannerStore } from '../store';
import { BannerDots } from './banner-dots';
import { BannerError } from './banner-error';
import { BannerLoading } from './banner-loading';
import { BannerNav } from './banner-nav';
import { BannerTrack } from './banner-track';

export function BannerSection() {
  const { banners, isLoading, isError, refetch } = useBannersQuery();
  const setActiveIndex = useBannerStore((s) => s.setActiveIndex);
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
  const [activeIndex, setLocalActiveIndex] = useState(0);

  const contextValue = useMemo(
    () => ({
      banners,
      isLoading,
      isError,
      refetch,
      activeIndex,
      emblaApi: emblaApi
        ? {
            scrollPrev: () => emblaApi.scrollPrev(),
            scrollNext: () => emblaApi.scrollNext(),
            scrollTo: (i: number) => emblaApi.scrollTo(i),
          }
        : undefined,
    }),
    [banners, isLoading, isError, refetch, activeIndex, emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      const i = emblaApi.selectedScrollSnap();
      setLocalActiveIndex(i);
      setActiveIndex(i);
    };
    emblaApi.on('select', onSelect);
    onSelect();
    return () => void emblaApi.off('select', onSelect);
  }, [emblaApi, setActiveIndex]);

  if (isError) {
    return (
      <section aria-label="Banner quảng báo">
        <div className="relative group overflow-hidden">
          <div className="overflow-hidden">
            <div className="flex">
              <div className="flex-[0_0_100%] min-w-0 relative">
                <BannerSectionContext.Provider value={contextValue}>
                  <BannerError />
                </BannerSectionContext.Provider>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isLoading || banners.length === 0) {
    return (
      <section aria-label="Banner quảng báo">
        <div className="relative group overflow-hidden">
          <div className="overflow-hidden">
            <div className="flex">
              <div className="flex-[0_0_100%] min-w-0 relative">
                <BannerLoading />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section aria-label="Banner quảng báo">
      <BannerSectionContext.Provider value={contextValue}>
        <div className="relative group overflow-hidden">
          <BannerTrack emblaRef={emblaRef} />
          <BannerNav />
          <BannerDots />
        </div>
      </BannerSectionContext.Provider>
    </section>
  );
}
