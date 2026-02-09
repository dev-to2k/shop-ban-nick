'use client';

import { Badge, Button, Skeleton } from '@shop-ban-nick/shared-web';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ArrowLeft, Clock, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { blogApi } from './api';

export function BlogDetail({ slug }: { slug: string }) {
  const { data: post, isLoading } = useQuery({
    queryKey: ['blog', slug],
    queryFn: () => blogApi.getBlogBySlug(slug),
  });

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );
  }

  if (!post) {
    return <div className="text-center py-20">Bài viết không tồn tại.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/blog">
        <Button
          variant="ghost"
          className="mb-4 pl-0 hover:pl-0 hover:bg-transparent hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại danh sách
        </Button>
      </Link>

      <div className="flex gap-2 mb-4">
        <Badge variant="secondary">News</Badge>
        {post.isActive === false && <Badge variant="destructive">Nháp</Badge>}
      </div>

      <h1 className="text-3xl md:text-4xl font-bold mb-6">{post.title}</h1>

      <div className="flex items-center gap-4 text-muted-foreground text-sm mb-8 border-b pb-8">
        <div className="flex items-center gap-1">
          <User className="h-4 w-4" />
          <span>{post.author || 'Admin'}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>
            {format(new Date(post.createdAt as string), 'dd/MM/yyyy')}
          </span>
        </div>
      </div>

      {post.thumbnail && (
        <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-8 shadow-lg">
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <article
        className="prose prose-neutral dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content || '' }}
      />
    </div>
  );
}
