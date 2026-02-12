'use client';

import { useQuery } from '@tanstack/react-query';
import { api, getAssetUrl, queryKeys } from '@shop-ban-nick/shared-web';
import type { BannerSlide } from '../types';

function toSlide(item: { image: string; title: string; subtitle: string; href: string; gradient: string; promo?: boolean }): BannerSlide {
  return {
    ...item,
    image: getAssetUrl(item.image) || item.image,
  };
}

export function useBannersQuery() {
  const query = useQuery({
    queryKey: queryKeys.banners.all,
    queryFn: () => api.getBanners(),
    staleTime: 60_000,
    retry: 2,
  });
  const list = Array.isArray(query.data) ? query.data : [];
  const banners: BannerSlide[] = list.map(toSlide);
  return { ...query, banners };
}
