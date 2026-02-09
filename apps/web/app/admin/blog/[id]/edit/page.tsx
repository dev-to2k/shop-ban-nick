'use client';

import { AdminBlogForm, blogApi } from '@shop-ban-nick/feature-blog';
import { Button } from '@shop-ban-nick/shared-web';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditBlogPage({ params }: { params: { id: string } }) {
  // Since we don't have getBlogById in mock API exposed properly for all cases,
  // we might need to fetch all and find, or just use getBlogBySlug if ID acts as slug in mock.
  // In real app, use getBlogById.
  // For mock, we'll try to find from getBlogs list or implement getById.
  // Let's assume getBlogs returns all.

  const { data: blogs } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogApi.getBlogs,
  });

  const blog = blogs?.find((b) => b.id === params.id);

  if (!blog && blogs) return <div>Không tìm thấy bài viết</div>;

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/blog">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Chỉnh sửa bài viết</h1>
      </div>
      {blog && <AdminBlogForm blog={blog} />}
    </div>
  );
}
