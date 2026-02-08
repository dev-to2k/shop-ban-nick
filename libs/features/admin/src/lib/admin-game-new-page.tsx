'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import type { CreateGameInput } from '@shop-ban-nick/shared-schemas';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Form, FormInput, FormTextarea, FormSelect, FormSubmitError } from '@shop-ban-nick/shared-web';
import { useBreadcrumb, api, queryKeys } from '@shop-ban-nick/shared-web';
import { generateSlug } from '@shop-ban-nick/shared-utils';

const attributeTypeOptions = [
  { value: 'TEXT', label: 'Text' },
  { value: 'NUMBER', label: 'Number' },
  { value: 'SELECT', label: 'Select' },
];

const gameNewFormSchema = z.object({
  name: z.string().min(1, 'Tên game là bắt buộc'),
  slug: z.string().min(1, 'Slug là bắt buộc'),
  thumbnail: z.string().optional(),
  description: z.string().optional(),
  attributes: z.array(z.object({
    name: z.string().min(1, 'Tên thuộc tính là bắt buộc'),
    type: z.enum(['TEXT', 'NUMBER', 'SELECT']),
    options: z.string().optional(),
  })).optional(),
});
type GameNewFormValues = z.infer<typeof gameNewFormSchema>;

function toCreateGamePayload(data: GameNewFormValues): CreateGameInput {
  return {
    ...data,
    attributes: data.attributes?.filter((a) => a.name).map((a) => ({
      name: a.name,
      type: a.type,
      options: a.type === 'SELECT' && a.options ? a.options.split(',').map((o) => o.trim()) : undefined,
    })),
  };
}

export function AdminGameNewPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setItems: setBreadcrumb } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumb([{ label: 'Trang chủ', href: '/' }, { label: 'Admin', href: '/admin' }, { label: 'Games', href: '/admin/games' }, { label: 'Thêm game' }]);
    return () => setBreadcrumb([]);
  }, [setBreadcrumb]);

  const form = useForm<GameNewFormValues>({
    resolver: zodResolver(gameNewFormSchema),
    defaultValues: { name: '', slug: '', thumbnail: '', description: '', attributes: [] },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'attributes' });

  const createMutation = useMutation({
    mutationFn: (data: GameNewFormValues) => api.admin.createGame(toCreateGamePayload(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.games });
      router.push('/admin/games');
    },
  });

  const onSubmit = (data: GameNewFormValues) => {
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
