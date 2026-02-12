'use client';

import { useContext } from 'react';
import { TrustBadgesSectionContext } from './context';

export function useTrustBadgesSection() {
  const ctx = useContext(TrustBadgesSectionContext);
  if (!ctx) throw new Error('useTrustBadgesSection must be used within TrustBadgesSection');
  return ctx;
}
