'use client';

import { useContext } from 'react';
import { GamesSectionContext } from '../context/games-section-context';

export function useGamesSection() {
  const ctx = useContext(GamesSectionContext);
  if (!ctx) throw new Error('useGamesSection must be used within GamesSection');
  return ctx;
}
