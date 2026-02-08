'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import {
  AdminAccountsProvider,
  api,
  queryKeys,
  useAdminAccountsContext,
  useBreadcrumb,
  useAdminGame,
  useAdminAccounts,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Skeleton,
  Form,
  FormInput,
} from '@shop-ban-nick/shared-web';
import { formatPrice } from '@shop-ban-nick/shared-utils';

const createAccountFormSchema = z.object({
  gameId: z.string(),
  code: z.string().min(1, 'Mã acc là bắt buộc'),
  title: z.string().min(1, 'Tiêu đề là bắt buộc'),
  description: z.string().optional(),
  price: z.number().min(0, 'Giá phải >= 0'),
  loginInfo: z.string().optional(),
  attributes: z.record(z.string(), z.string()).optional(),
});
type CreateAccountFormValues = z.infer<typeof createAccountFormSchema>;

const statusColors: Record<string, 'success' | 'default' | 'warning' | 'secondary'> = {
  AVAILABLE: 'success', SOLD: 'default', RESERVED: 'warning', HIDDEN: 'secondary',
};

function AdminGameAccountsContent() {
  const queryClient = useQueryClient();
  const { setItems: setBreadcrumb } = useBreadcrumb();
  const { gameId, page, setPage } = useAdminAccountsContext();
  const { data: game } = useAdminGame(gameId);
  const { data: accountsData, isLoading } = useAdminAccounts({ gameId, page });
  const [showForm, setShowForm] = useState(false);

  const accounts = accountsData?.data ?? [];
  const meta = accountsData?.meta ?? null;

  const form = useForm<CreateAccountFormValues>({
    resolver: zodResolver(createAccountFormSchema),
    defaultValues: { code: '', gameId, title: '', description: '', price: 0, loginInfo: '', attributes: {} },
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateAccountFormValues) => api.admin.createAccount(data),
    onSuccess: () => {
      form.reset({ code: '', gameId, title: '', description: '', price: 0, loginInfo: '', attributes: {} });
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.accountsByGame(gameId) });
    },
    onError: (err: unknown) => {
      alert(err instanceof Error ? err.message : 'Tạo acc thất bại');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.admin.deleteAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.accountsByGame(gameId) });
    },
    onError: (err: unknown) => {
      alert(err instanceof Error ? err.message : 'Xóa thất bại');
    },
  });

  const handleDelete = (id: string) => {
    if (!confirm('Xóa acc này?')) return;
    deleteMutation.mutate(id);
  };

  const gameName = game?.name ?? 'Game';

  useEffect(() => {
    setBreadcrumb([{ label: 'Trang chủ', href: '/' }, { label: 'Admin', href: '/admin' }, { label: 'Games', href: '/admin/games' }, { label: gameName, href: `/admin/games/${gameId}` }, { label: 'Tài khoản' }]);
    return () => setBreadcrumb([]);
  }, [setBreadcrumb, gameId, gameName]);

  return (
    <div>
      <Link href="/admin/games"><Button variant="ghost" size="sm" className="mb-4"><ArrowLeft className="h-4 w-4 mr-1" /> Games</Button></Link>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Acc: {game?.name || '...'}</h1>
          <p className="text-sm text-muted-foreground">{meta?.total || 0} acc tổng cộng</p>
        </div>
        <Button size="sm" onClick={() => setShowForm(!showForm)}><Plus className="h-4 w-4 mr-1" /> Thêm acc</Button>
      </div>
      {showForm && (
        <Card className="mb-6">
          <CardHeader><CardTitle className="text-base">Thêm acc mới</CardTitle></CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))} className="grid grid-cols-2 gap-3">
                <FormInput name="code" label="Mã acc" placeholder="Mã acc" required />
                <FormInput name="title" label="Tiêu đề" placeholder="Tiêu đề" required />
                <FormInput name="price" label="Giá (VND)" placeholder="Giá" type="number" valueAsNumber required />
                <FormInput name="loginInfo" label="Thông tin login" placeholder="Thông tin login" />
                <FormInput name="description" label="Mô tả" placeholder="Mô tả" className="col-span-2" />
                <div className="col-span-2 flex gap-2">
                  <Button type="submit" disabled={createMutation.isPending}>
                    <Check className="h-4 w-4 mr-1" />
                    {createMutation.isPending ? 'Đang tạo...' : 'Tạo'}
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => setShowForm(false)}><X className="h-4 w-4 mr-1" />Hủy</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
      ) : accounts.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">Chưa có acc nào</div>
      ) : (
        <>
          <div className="space-y-2">
            {accounts.map((acc) => (
              <Card key={acc.id}>
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">{acc.code}</span>
                      <Badge variant={statusColors[acc.status] ?? 'secondary'}>{acc.status}</Badge>
                    </div>
                    <p className="text-sm font-medium truncate">{acc.title}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-semibold text-sm tabular-nums">{formatPrice(Number(acc.price))}</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(acc.id)} disabled={deleteMutation.isPending}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {meta && meta.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}><ChevronLeft className="h-4 w-4 mr-1" />Trước</Button>
              <span className="flex items-center text-sm">{page}/{meta.totalPages}</span>
              <Button variant="outline" size="sm" disabled={page >= meta.totalPages} onClick={() => setPage(page + 1)}>Sau<ChevronRight className="h-4 w-4 ml-1" /></Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function AdminGameAccountsPage({ gameId }: { gameId: string }) {
  return (
    <AdminAccountsProvider gameId={gameId}>
      <AdminGameAccountsContent />
    </AdminAccountsProvider>
  );
}
