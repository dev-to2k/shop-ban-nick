'use client';

import { Button, Input, Label, Textarea } from '@shared/components';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { blogApi } from './blog-api';

export function AdminBlogForm({ blog }: { blog?: any }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: blog?.title || '',
    slug: blog?.slug || '',
    excerpt: blog?.excerpt || '',
    content: blog?.content || '',
    thumbnail: blog?.thumbnail || '',
  });

  const mutation = useMutation({
    mutationFn: (data: any) =>
      blog ? blogApi.updateBlog(blog.id, data) : blogApi.createBlog(data),
    onSuccess: () => {
      toast.success(blog ? 'Cập nhật thành công' : 'Tạo bài viết thành công');
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      router.push('/admin/blog');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="space-y-2">
        <Label>Tiêu đề</Label>
        <Input
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Slug (URL)</Label>
        <Input
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          placeholder="tu-dong-tao-neu-trong"
        />
      </div>

      <div className="space-y-2">
        <Label>Mô tả ngắn</Label>
        <Textarea
          value={formData.excerpt}
          onChange={(e) =>
            setFormData({ ...formData, excerpt: e.target.value })
          }
        />
      </div>

      <div className="space-y-2">
        <Label>Nội dung (HTML/Markdown)</Label>
        <Textarea
          className="min-h-[300px] font-mono"
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
        />
      </div>

      <div className="space-y-2">
        <Label>Thumbnail URL</Label>
        <Input
          value={formData.thumbnail}
          onChange={(e) =>
            setFormData({ ...formData, thumbnail: e.target.value })
          }
        />
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Hủy
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Đang lưu...' : blog ? 'Cập nhật' : 'Tạo mới'}
        </Button>
      </div>
    </form>
  );
}
