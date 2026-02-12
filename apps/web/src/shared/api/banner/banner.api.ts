import { fetcher } from '../core';

export const bannerApi = {
  getBanners: () =>
    fetcher<{ image: string; title: string; subtitle: string; href: string; gradient: string; promo?: boolean }[]>('/banners'),
};
