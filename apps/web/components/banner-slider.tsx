'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BannerSlide {
  image: string;
  title: string;
  subtitle: string;
  href: string;
  gradient: string;
}

const banners: BannerSlide[] = [
  {
    image: '/banners/banner-lien-quan-mobile.png',
    title: 'Liên Quân Mobile',
    subtitle: 'Acc VIP giá rẻ - Full tướng, full skin',
    href: '/games/lien-quan-mobile',
    gradient: 'from-blue-900/90 via-blue-900/50 to-transparent',
  },
  {
    image: '/banners/banner-free-fire.png',
    title: 'Free Fire',
    subtitle: 'Acc Thách Đấu - Full nhân vật VIP',
    href: '/games/free-fire',
    gradient: 'from-orange-900/90 via-orange-900/50 to-transparent',
  },
  {
    image: '/banners/banner-crossfire.png',
    title: 'CrossFire (Đột Kích)',
    subtitle: 'Acc VIP full súng - KD cao',
    href: '/games/crossfire',
    gradient: 'from-emerald-900/90 via-emerald-900/50 to-transparent',
  },
  {
    image: '/banners/banner-genshin-impact.png',
    title: 'Genshin Impact',
    subtitle: 'Acc AR cao - Nhiều nhân vật 5 sao',
    href: '/games/genshin-impact',
    gradient: 'from-cyan-900/90 via-cyan-900/50 to-transparent',
  },
  {
    image: '/banners/banner-pubg-mobile.png',
    title: 'PUBG Mobile',
    subtitle: 'Acc Vương Giả - Set skin súng hiếm',
    href: '/games/pubg-mobile',
    gradient: 'from-amber-900/90 via-amber-900/50 to-transparent',
  },
  {
    image: '/banners/banner-valorant.png',
    title: 'Valorant',
    subtitle: 'Acc Immortal+ full Agent & skin',
    href: '/games/valorant',
    gradient: 'from-rose-900/90 via-rose-900/50 to-transparent',
  },
];

/* ── Dot indicator ─────────────────────────────── */
function DotButton({ active, onClick, index }: { active: boolean; onClick: () => void; index: number }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Go to slide ${index + 1}`}
      className={`h-2 rounded-full transition-all duration-300 ${
        active ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
      }`}
    />
  );
}

/* ── Arrow button ──────────────────────────────── */
function ArrowButton({ dir, onClick }: { dir: 'prev' | 'next'; onClick: () => void }) {
  const Icon = dir === 'prev' ? ChevronLeft : ChevronRight;
  const pos = dir === 'prev' ? 'left-3' : 'right-3';

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === 'prev' ? 'Previous slide' : 'Next slide'}
      className={`absolute ${pos} top-1/2 -translate-y-1/2 z-10
        flex h-10 w-10 items-center justify-center rounded-full
        bg-black/20 text-white/70 backdrop-blur-sm
        opacity-0 group-hover:opacity-100
        hover:bg-black/40 hover:text-white hover:scale-110
        active:scale-95
        transition-all duration-200`}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}

/* ── Slide content ─────────────────────────────── */
function SlideContent({ banner }: { banner: BannerSlide }) {
  return (
    <div className="flex-[0_0_100%] min-w-0 relative">
      <Link href={banner.href} className="block">
        <div className="relative w-full overflow-hidden aspect-[16/10] min-h-[200px] sm:aspect-[21/9] sm:min-h-[240px] md:aspect-[3/1] md:min-h-[280px]">
          <Image
            src={banner.image}
            alt={banner.title}
            fill
            className="object-cover object-center"
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
          />

          <div className={`absolute inset-0 bg-linear-to-r ${banner.gradient}`} />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

          <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 md:p-8 lg:p-12">
            <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white drop-shadow-lg tracking-tight">
              {banner.title}
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-white/80 mt-1 sm:mt-1.5 max-w-lg drop-shadow">
              {banner.subtitle}
            </p>
            <span className="mt-2 sm:mt-3 inline-flex w-fit items-center gap-1.5
              bg-white/15 backdrop-blur-md text-white
              px-3 py-1.5 sm:px-4 sm:py-2 rounded-full
              text-xs sm:text-sm font-medium
              border border-white/20
              hover:bg-white/25 transition-colors">
              Xem ngay
              <ChevronRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

/* ── Main slider ───────────────────────────────── */
export function BannerSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true }),
  ]);
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

  return (
    <div className="relative group overflow-hidden">
      {/* Slides */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {banners.map((b) => <SlideContent key={b.href} banner={b} />)}
        </div>
      </div>

      {/* Arrows */}
      <ArrowButton dir="prev" onClick={scrollPrev} />
      <ArrowButton dir="next" onClick={scrollNext} />

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5">
        {banners.map((b, i) => (
          <DotButton key={b.href} active={i === activeIndex} index={i} onClick={() => scrollTo(i)} />
        ))}
      </div>
    </div>
  );
}
