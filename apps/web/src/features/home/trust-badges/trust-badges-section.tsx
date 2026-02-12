'use client';

import { TrustBadges } from '@shared';
import { TrustBadgesSectionContext } from './context';
import type { SectionVariant } from './context';

interface TrustBadgesSectionProps {
  sectionVariant?: SectionVariant;
}

export function TrustBadgesSection({ sectionVariant = 'slate' }: TrustBadgesSectionProps) {
  return (
    <TrustBadgesSectionContext.Provider value={{ sectionVariant }}>
      <TrustBadges sectionVariant={sectionVariant} />
    </TrustBadgesSectionContext.Provider>
  );
}
