'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { Gamepad2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api';
import { queryKeys } from '@/lib/query-keys';
import { useBreadcrumb } from '@/lib/breadcrumb-context';

export default function GamesPage() {
  const { setItems: setBreadcrumb } = useBreadcrumb();
  const { data: games = [], isLoading } = useQuery({
    queryKey: queryKeys.games.all,
    queryFn: () => api.getGames(),
  });

  useEffect(() => {
    setBreadcrumb([{ label: 'Trang chủ', href: '/' }, { label: 'Danh sách game' }]);
    return () => setBreadcrumb([]);
  }, [setBreadcrumb]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Danh sách game</h1>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <Card key={i}><CardContent className="p-4"><Skeleton className="h-36 w-full mb-3" /><Skeleton className="h-4 w-3/4" /></CardContent></Card>
          ))}
        </div>
      ) : games.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Gamepad2 className="h-12 w-12 mx-auto mb-4" />
          <p>Chưa có game nào. Vui lòng quay lại sau!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {games.map((game: any) => (
            <Link key={game.id} href={`/games/${game.slug}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer group flex flex-col h-full">
                {/* Thumbnail - fixed height */}
                <div className="h-40 bg-muted rounded-t-xl flex items-center justify-center overflow-hidden shrink-0">
                  {game.thumbnail ? (
                    <Image src={game.thumbnail} alt={game.name} width={400} height={300} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <Gamepad2 className="h-12 w-12 text-muted-foreground" />
                  )}
                </div>
                {/* Info stack - fixed layout */}
                <CardContent className="p-3 flex flex-col flex-1">
                  <h3 className="font-semibold text-sm line-clamp-1">{game.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 shrink-0">
                    {game._count?.accounts || 0} acc có sẵn
                  </p>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2 h-8">
                    {game.description || ''}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
