'use client';

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@shop-ban-nick/shared-web';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  thumbnail?: string;
  excerpt?: string;
  author?: string;
  createdAt: string | Date;
}

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Card className="overflow-hidden flex flex-col h-full group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {post.thumbnail ? (
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary/50">
            No Image
          </div>
        )}
      </div>
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-center mb-2">
          <Badge variant="secondary" className="text-xs font-normal">
            News
          </Badge>
          <span className="text-xs text-muted-foreground">
            {format(new Date(post.createdAt), 'dd/MM/yyyy')}
          </span>
        </div>
        <CardTitle className="line-clamp-2 text-lg group-hover:text-primary transition-colors">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-1">
        <CardDescription className="line-clamp-3 text-sm">
          {post.excerpt ?? 'No description available.'}
        </CardDescription>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/blog/${post.slug}`} className="w-full">
          <Button
            variant="outline"
            className="w-full group-hover:border-primary/50 group-hover:bg-primary/5"
          >
            Read More
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
