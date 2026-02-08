'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, X, Save } from 'lucide-react';
import Link from 'next/link';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateGameSchema, type UpdateGameInput } from '@shop-ban-nick/shared-schemas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/ui/form-input';
import { FormTextarea } from '@/components/ui/form-textarea';
import { FormSelect } from '@/components/ui/form-select';
import { FormCheckbox } from '@/components/ui/form-checkbox';
import { FormSubmitError } from '@/components/ui/form-submit-error';
import { api } from '@/lib/api';
import { useBreadcrumb } from '@/lib/breadcrumb-context';
import { queryKeys } from '@/lib/query-keys';
import { useAdminGame } from '@/hooks/use-admin-game';

const attributeTypeOptions = [
  { value: 'TEXT', label: 'Text' },
  { value: 'NUMBER', label: 'Number' },
  { value: 'SELECT', label: 'Select' },
];

export default function EditGameClient({ gameId }: { gameId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: game, isLoading } = useAdminGame(gameId);
  const { setItems: setBreadcrumb } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumb([{ label: 'Trang chủ', href: '/' }, { label: 'Admin', href: '/admin' }, { label: 'Games', href: '/admin/games' }, { label: game?.name ?? 'Sửa game' }]);
    return () => setBreadcrumb([]);
  }, [setBreadcrumb, game?.name]);

  const form = useForm<UpdateGameInput>({
    resolver: zodResolver(updateGameSchema),
    defaultValues: { name: '', slug: '', thumbnail: '', description: '', isActive: true, attributes: [] },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'attributes' });

  useEffect(() => {
    if (game) {
      form.reset({
        name: game.name,
        slug: game.slug,
        thumbnail: game.thumbnail || '',
        description: game.description || '',
        isActive: game.isActive,
        attributes: game.attributes?.map((a: { name: string; type: string; options?: string[] }) => ({
          name: a.name,
          type: a.type as 'TEXT' | 'NUMBER' | 'SELECT',
          options: a.type === 'SELECT' && a.options ? a.options.join(', ') : '',
        })) || [],
      });
    }
  }, [game, form]);

  const updateMutation = useMutation({
    mutationFn: (data: UpdateGameInput) =>
      api.admin.updateGame(gameId, {
        ...data,
        attributes: data.attributes?.filter((a) => a.name).map((a) => ({
          name: a.name,
          type: a.type,
          options: a.type === 'SELECT' && a.options ? a.options.split(',').map((o: string) => o.trim()) : undefined,
        })),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.games });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.gameById(gameId) });
      router.push('/admin/games');
    },
  });

  const onSubmit = (data: UpdateGameInput) => {
    updateMutation.mutate(data);
  };

  if (isLoading) return <div className="p-8 text-muted-foreground">Đang tải...</div>;

  return (
    <div className="max-w-2xl">
      <Link href="/admin/games"><Button variant="ghost" size="sm" className="mb-4"><ArrowLeft className="h-4 w-4 mr-1" /> Games</Button></Link>
      <h1 className="text-2xl font-bold mb-6">Sửa game</h1>
      <FormSubmitError error={updateMutation.isError ? updateMutation.error : null} fallbackMessage="Cập nhật thất bại" className="mb-4" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Thông tin game</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <FormInput name="name" label="Tên game" required />
              <FormInput name="slug" label="Slug" required />
              <FormInput name="thumbnail" label="Thumbnail URL" />
              <FormTextarea name="description" label="Mô tả" />
              <FormCheckbox name="isActive" label="Active" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Thuộc tính acc</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={() => append({ name: '', type: 'TEXT', options: '' })}>
                  <Plus className="h-3 w-3 mr-1" /> Thêm
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {fields.map((f, i) => (
                <div key={f.id} className="flex gap-2 items-start">
                  <FormInput name={`attributes.${i}.name`} placeholder="Tên" className="flex-1" />
                  <FormSelect name={`attributes.${i}.type`} options={attributeTypeOptions} triggerClassName="w-[120px]" />
                  {form.watch(`attributes.${i}.type`) === 'SELECT' && (
                    <FormInput name={`attributes.${i}.options`} placeholder="Options" className="flex-1" />
                  )}
                  <Button type="button" variant="ghost" size="icon" onClick={() => remove(i)}><X className="h-4 w-4" /></Button>
                </div>
              ))}
            </CardContent>
          </Card>
          <Button type="submit" className="w-full" disabled={updateMutation.isPending}>
            <Save className="h-4 w-4 mr-2" />
            {updateMutation.isPending ? 'Đang lưu...' : 'Cập nhật'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
