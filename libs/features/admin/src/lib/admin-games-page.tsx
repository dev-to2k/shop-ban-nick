'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Gamepad2, Package } from 'lucide-react';
import { Button, Card, CardContent, Badge, Skeleton } from '@shop-ban-nick/shared-web';
import { api, getAssetUrl, queryKeys, useBreadcrumb } from '@shop-ban-nick/shared-web';

export function AdminGamesPage() {
  const queryClient = useQueryClient();
  const { setItems: setBreadcrumb } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumb([{ label: 'Trang chủ', href: '/' }, { label: 'Admin', href: '/admin' }, { label: 'Games' }]);
    return () => setBreadcrumb([]);
  }, [setBreadcrumb]);

  const { data: games = [], isLoading } = useQuery({
    queryKey: queryKeys.admin.games,
    queryFn: () => api.admin.getGames(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.admin.deleteGame(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.games });
    },
    onError: (err: Error & { message?: string }) => {
      alert(err.message);
    },
  });

  const handleDelete = (id: string) => {
    if (!confirm('Xóa game này? Tất cả acc thuộc game sẽ bị xóa.')) return;
    deleteMutation.mutate(id);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Quản lý game</h1>
        <Link href="/admin/games/new">
          <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Thêm game</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}</div>
      ) : games.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Gamepad2 className="h-12 w-12 mx-auto mb-4" />
          <p>Chưa có game nào</p>
        </div>
      ) : (
        <div className="space-y-3">
          {games.map((game: { id: string; name: string; slug: string; thumbnail?: string; isActive?: boolean; _count?: { accounts?: number }; attributes?: unknown[] }) => (
            <Card key={game.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 bg-muted rounded-md flex items-center justify-center overflow-hidden shrink-0">
                    {game.thumbnail ? <Image src={getAssetUrl(game.thumbnail)} alt="" width={56} height={56} className="w-full h-full object-cover" /> : <Gamepad2 className="h-6 w-6 text-muted-foreground" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{game.name}</h3>
                      <Badge variant={game.isActive ? 'success' : 'secondary'}>{game.isActive ? 'Active' : 'Hidden'}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">/{game.slug} &middot; {game._count?.accounts || 0} acc &middot; {game.attributes?.length || 0} thuộc tính</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Link href={`/admin/games/${game.id}`}>
                    <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                  </Link>
                  <Link href={`/admin/games/${game.id}/accounts`}>
                    <Button variant="ghost" size="sm"><Package className="h-4 w-4 mr-1" />Acc</Button>
                  </Link>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(game.id)} disabled={deleteMutation.isPending}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
