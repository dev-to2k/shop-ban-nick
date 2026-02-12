'use client';

import { createContext } from 'react';

export type SectionVariant = 'white' | 'slate';

export interface TrustBadgesSectionContextValue {
  sectionVariant: SectionVariant;
}

export const TrustBadgesSectionContext = createContext<TrustBadgesSectionContextValue | null>(null);
