'use client';

import { useContext } from 'react';
import { HeroSectionContext } from './context';

export function useHeroSection() {
  const ctx = useContext(HeroSectionContext);
  if (!ctx) throw new Error('useHeroSection must be used within HeroSection');
  return ctx;
}
