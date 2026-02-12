'use client';

import { useContext } from 'react';
import { BannerSectionContext } from '../context/banner-section-context';

export function useBannerSection() {
  const ctx = useContext(BannerSectionContext);
  if (!ctx) throw new Error('useBannerSection must be used within BannerSection');
  return ctx;
}
