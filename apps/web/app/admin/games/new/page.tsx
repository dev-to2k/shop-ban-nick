'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createGameSchema, type CreateGameInput } from '@shop-ban-nick/shared-schemas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/ui/form-input';
import { FormTextarea } from '@/components/ui/form-textarea';
import { FormSelect } from '@/components/ui/form-select';
import { FormSubmitError } from '@/components/ui/form-submit-error';
import { useBreadcrumb } from '@/lib/breadcrumb-context';
import { api } from '@/lib/api';
import { queryKeys } from '@/lib/query-keys';
import { generateSlug } from '@shop-ban-nick/shared-utils';

const attributeTypeOptions = [
  { value: 'TEXT', label: 'Text' },
  { value: 'NUMBER', label: 'Number' },
  { value: 'SELECT', label: 'Select' },
];

export default function NewGamePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setItems: setBreadcrumb } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumb([{ label: 'Trang chủ', href: '/' }, { label: 'Admin', href: '/admin' }, { label: 'Games', href: '/admin/games' }, { label: 'Thêm game' }]);
    return () => setBreadcrumb([]);
  }, [setBreadcrumb]);

  const form = useForm<CreateGameInput>({
    resolver: zodResolver(createGameSchema),
    defaultValues: { name: '', slug: '', thumbnail: '', description: '', attributes: [] },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'attributes' });

  const createMutation = useMutation({
    mutationFn: (data: CreateGameInput) => {
      const payload = {
        ...data,
        attributes: data.attributes?.filter((a) => a.name).map((a) => ({
          name: a.name,
          type: a.type,
          options: a.type === 'SELECT' && a.options ? a.options.split(',').map((o) => o.trim()) : undefined,
        })),
      };
      return api.admin.createGame(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.games });
      router.push('/admin/games');
    },
  });

  const onSubmit = (data: CreateGameInput) => {
    createMutation.mutate(data);
  };

  return (
    <div className="max-w-2xl">
      <Link href="/admin/games"><Button variant="ghost" size="sm" className="mb-4"><ArrowLeft className="h-4 w-4 mr-1" /> Games</Button></Link>

      <h1 className="text-2xl font-bold mb-6">Thêm game mới</h1>

      <FormSubmitError error={createMutation.isError ? createMutation.error : null} fallbackMessage="Tạo game thất bại" className="mb-4" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Thông tin game</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <FormInput
                name="name"
                label="Tên game"
                placeholder="Liên Quân Mobile"
                required
                onChange={(e) => form.setValue('slug', generateSlug(e.target.value))}
              />
              <FormInput name="slug" label="Slug" placeholder="lien-quan-mobile" required />
              <FormInput name="thumbnail" label="Thumbnail URL" placeholder="https://..." />
              <FormTextarea name="description" label="Mô tả" placeholder="Mô tả game..." />
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
              {fields.length === 0 && <p className="text-sm text-muted-foreground">Chưa có thuộc tính. VD: Rank, Level, Số tướng...</p>}
              {fields.map((f, i) => (
                <div key={f.id} className="flex gap-2 items-start">
                  <FormInput name={`attributes.${i}.name`} placeholder="Tên (VD: Rank)" className="flex-1" />
                  <FormSelect name={`attributes.${i}.type`} options={attributeTypeOptions} triggerClassName="w-[120px]" />
                  {form.watch(`attributes.${i}.type`) === 'SELECT' && (
                    <FormInput name={`attributes.${i}.options`} placeholder="Options (phẩy)" className="flex-1" />
                  )}
                  <Button type="button" variant="ghost" size="icon" onClick={() => remove(i)}><X className="h-4 w-4" /></Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Button type="submit" className="w-full" disabled={createMutation.isPending}>
            <Plus className="h-4 w-4 mr-2" />
            {createMutation.isPending ? 'Đang tạo...' : 'Tạo game'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
