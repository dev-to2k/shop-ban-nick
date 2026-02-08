'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api, getAssetUrl } from '@/lib/api';
import { queryKeys } from '@/lib/query-keys';
import { Gamepad2, Store, MapPin, Search, ArrowDownNarrowWide, ArrowUpNarrowWide, ArrowRight, Headphones } from 'lucide-react';
import { CardImage } from '@/components/ui/card-image';

function GameThumb({ name, src }: { name: string; src?: string | null }) {
  return (
    <CardImage
      src={src ?? ''}
      alt={`${name} - thumbnail`}
      wrapperClassName="relative w-full aspect-4/3 min-h-40 overflow-hidden bg-card rounded-t-xl shrink-0 flex items-center justify-center"
      imageClassName="object-cover object-center group-hover:scale-105 transition-transform"
      sizes="(max-width: 30em) 50vw, (max-width: 48em) 33vw, (max-width: 62em) 25vw, 20vw"
      lazy={false}
      unoptimized
      fallback={<Gamepad2 className="h-12 w-12 text-muted-foreground shrink-0" />}
    />
  );
}

type GameItem = {
  id: string;
  name: string;
  slug: string;
  thumbnail?: string | null;
  description?: string;
  _count?: { accounts: number };
};

function GameStoreCard({ game }: { game: GameItem }) {
  return (
    <Link href={`/games/${game.slug}`} className="block h-full">
      <Card className="border-2 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer flex flex-col h-full group overflow-hidden">
        <div className="relative">
          <GameThumb name={game.name} src={getAssetUrl(game.thumbnail)} />
        </div>
        <CardContent className="p-3 flex flex-col flex-1">
          <CardTitle className="font-semibold text-sm line-clamp-1">{game.name}</CardTitle>
          <CardDescription className="text-xs mt-1 shrink-0">
            {game._count?.accounts ?? 0} acc có sẵn
          </CardDescription>
          <CardDescription className="text-xs mt-2 line-clamp-2 h-8">
            {game.description || ''}
          </CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}

type SortKey = 'name_asc' | 'name_desc' | 'accounts_desc' | 'accounts_asc';

export function GamesMall() {
  const searchParams = useSearchParams();
  const qFromUrl = searchParams.get('q') ?? '';
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortKey>('name_asc');

  useEffect(() => {
    if (qFromUrl) setSearch(qFromUrl);
  }, [qFromUrl]);

  const { data: games = [], isLoading } = useQuery({
    queryKey: queryKeys.games.all,
    queryFn: () => api.getGames(),
  });

  const filteredAndSorted = useMemo(() => {
    const list = games as GameItem[];
    const q = search.trim().toLowerCase();
    const filtered = q
      ? list.filter(
          (g) =>
            g.name.toLowerCase().includes(q) ||
            (g.description ?? '').toLowerCase().includes(q)
        )
      : list;
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name_desc') return b.name.localeCompare(a.name);
      const ca = a._count?.accounts ?? 0;
      const cb = b._count?.accounts ?? 0;
      if (sortBy === 'accounts_desc') return cb - ca;
      return ca - cb;
    });
    return sorted;
  }, [games, search, sortBy]);

  const featured = (games as GameItem[]).slice(0, 4);

  return (
    <div className="space-y-0">
      <header className="text-center pb-4">
        <h1 className="text-fluid-hero font-bold tracking-tight">Trung tâm Game</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Chọn gian hàng — Xem acc — Thanh toán nhanh
        </p>
      </header>

      <div
        className="flex items-center justify-center gap-2 py-3 border-y border-border bg-muted/30"
        aria-hidden
      >
        <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
        <span className="text-sm text-muted-foreground">Chọn gian hàng game bên dưới</span>
        <Store className="h-4 w-4 text-muted-foreground shrink-0" />
      </div>

      <section className="py-4">
        <div className="flex flex-col gap-3">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Tìm game theo tên..."
              className="pl-9 h-9 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={sortBy === 'name_asc' ? 'default' : 'outline'}
              size="sm"
              className="h-9"
              onClick={() => setSortBy('name_asc')}
            >
              Tên A-Z
            </Button>
            <Button
              variant={sortBy === 'name_desc' ? 'default' : 'outline'}
              size="sm"
              className="h-9"
              onClick={() => setSortBy('name_desc')}
            >
              Tên Z-A
            </Button>
            <Button
              variant={sortBy === 'accounts_desc' ? 'default' : 'outline'}
              size="sm"
              className="h-9"
              onClick={() => setSortBy('accounts_desc')}
            >
              <ArrowDownNarrowWide className="h-4 w-4 mr-1" />Nhiều acc
            </Button>
            <Button
              variant={sortBy === 'accounts_asc' ? 'default' : 'outline'}
              size="sm"
              className="h-9"
              onClick={() => setSortBy('accounts_asc')}
            >
              <ArrowUpNarrowWide className="h-4 w-4 mr-1" />Ít acc
            </Button>
          </div>
        </div>
      </section>

      {isLoading ? (
        <>
          <section className="pt-2">
            <h2 className="text-lg font-semibold mb-4">Gian hàng nổi bật</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="border-2 rounded-xl overflow-hidden">
                  <Skeleton className="aspect-4/3 w-full min-h-40 rounded-none" />
                  <CardContent className="p-3">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
          <section className="pt-8">
            <h2 className="text-lg font-semibold mb-4">Tất cả gian hàng</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <Card key={i} className="border-2 rounded-xl overflow-hidden">
                  <Skeleton className="aspect-4/3 w-full min-h-40 rounded-none" />
                  <CardContent className="p-3">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </>
      ) : (games as GameItem[]).length === 0 ? (
        <div className="text-center py-16 sm:py-20 text-muted-foreground">
          <Gamepad2 className="h-12 w-12 mx-auto mb-4" />
          <p>Chưa có game nào. Vui lòng quay lại sau!</p>
        </div>
      ) : (
        <>
          {featured.length > 0 && (
            <section className="pt-2" aria-labelledby="featured-heading">
              <h2 id="featured-heading" className="text-lg font-semibold mb-4">
                Gian hàng nổi bật
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                {featured.map((game) => (
                  <GameStoreCard key={game.id} game={game} />
                ))}
              </div>
            </section>
          )}

          <section className="pt-8" aria-labelledby="all-stores-heading">
            <h2 id="all-stores-heading" className="text-lg font-semibold mb-4">
              Tất cả gian hàng
            </h2>
            {filteredAndSorted.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Search className="h-10 w-10 mx-auto mb-3 opacity-50" />
                <p>Không tìm thấy game phù hợp. Thử đổi từ khoá hoặc bộ lọc.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {filteredAndSorted.map((game) => (
                  <GameStoreCard key={game.id} game={game} />
                ))}
              </div>
            )}
          </section>

          <section className="pt-10 pb-4 border-t border-border mt-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl bg-muted/40 p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                  <Headphones className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Cần hỗ trợ?</h3>
                  <p className="text-xs text-muted-foreground">
                    Liên hệ để được tư vấn chọn game và acc phù hợp.
                  </p>
                </div>
              </div>
              <Link href="/" className="shrink-0">
                <Button variant="outline" size="sm">
                  Về trang chủ <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
