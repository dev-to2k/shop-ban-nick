'use client';

import { createContext } from 'react';

export interface HeroSectionContextValue {
  accLabel: string;
}

export const HeroSectionContext = createContext<HeroSectionContextValue | null>(null);
