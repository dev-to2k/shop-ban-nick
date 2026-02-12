'use client';

import { CarouselNavButton, carouselNavButtonPositions } from '@shop-ban-nick/shared-web';
import { useBannerSection } from '../hooks';

export function BannerNav() {
  const { emblaApi } = useBannerSection();
  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();
  return (
    <>
      <CarouselNavButton dir="prev" onClick={scrollPrev} className={carouselNavButtonPositions.banner.prev} />
      <CarouselNavButton dir="next" onClick={scrollNext} className={carouselNavButtonPositions.banner.next} />
    </>
  );
}
