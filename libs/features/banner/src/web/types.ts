export interface BannerSlide {
  image?: string;
  title: string;
  subtitle: string;
  href: string;
  gradient: string;
  promo?: boolean;
}

export interface BannerSectionContextValue {
  banners: BannerSlide[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  activeIndex: number;
  emblaApi: { scrollPrev: () => void; scrollNext: () => void; scrollTo: (i: number) => void } | undefined;
}
