'use client';

import { useMemo } from 'react';
import { GamesSectionContext } from '../context/games-section-context';
import { useGamesQuery } from '../hooks';
import type { GamesListVariant, SectionVariant } from '../types';
import { GamesError } from './games-error';
import { GamesListContent } from './games-list-content';
import { GamesLoading } from './games-loading';

interface GamesSectionProps {
  variant?: GamesListVariant;
  sectionVariant?: SectionVariant;
}

export function GamesSection({
  variant = 'full',
  sectionVariant = 'slate',
}: GamesSectionProps) {
  const { data: games = [], isLoading, isError, refetch } = useGamesQuery();

  const contextValue = useMemo(
    () => ({
      games,
      isLoading,
      isError,
      refetch,
      variant,
      sectionVariant,
    }),
    [games, isLoading, isError, refetch, variant, sectionVariant]
  );

  return (
    <GamesSectionContext.Provider value={contextValue}>
      {isError && <GamesError />}
      {!isError && isLoading && <GamesLoading />}
      {!isError && !isLoading && <GamesListContent />}
    </GamesSectionContext.Provider>
  );
}
