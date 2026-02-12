import { AdminBlogForm } from '@features/blog/admin-blog-form';
import { Button } from '@shared/components';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewBlogPage() {
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/blog">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Viết bài mới</h1>
      </div>
      <AdminBlogForm />
    </div>
  );
}
