'use client';

import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import { useProduct } from '../../contexts';
import { useGame } from '../../hooks';

export function GameHeader() {
  const { slug } = useProduct();
  const { data: game, isLoading } = useGame(slug);

  if (isLoading || !game) {
    return (
      <div className="mb-6">
        <Skeleton className="h-5 w-48 mb-2" />
        <Skeleton className="h-9 w-48 mb-2" />
        <Skeleton className="h-4 w-72" />
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold">{game.name}</h1>
      {game.description && <p className="text-muted-foreground mt-1">{game.description}</p>}
      <Badge variant="secondary" className="mt-2">{game._count?.accounts || 0} acc có sẵn</Badge>
    </div>
  );
}
