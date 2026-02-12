'use client';

import { HomeHero } from '@shared';
import { HeroSectionContext } from './context';

interface HeroSectionProps {
  accLabel: string;
}

export function HeroSection({ accLabel }: HeroSectionProps) {
  return (
    <HeroSectionContext.Provider value={{ accLabel }}>
      <HomeHero accLabel={accLabel} />
    </HeroSectionContext.Provider>
  );
}
