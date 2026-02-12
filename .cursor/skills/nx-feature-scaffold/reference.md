# NX Feature Scaffold — Code Reference

Replace `blog` / `Blog` with your feature name.

## BlogList.tsx (page component)

```tsx
import { useBlogList } from './useBlogList';
import { Skeleton } from '@shop-ban-nick/shared-web';
import { BlogCard } from './BlogCard';

export const BlogList = () => {
  const { data, isLoading } = useBlogList();
  if (isLoading) return <Skeleton />;
  return (
    <div>
      {data?.map((blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  );
};
```

## useBlogList.ts (hook)

```ts
import { useQuery } from '@tanstack/react-query';
import { blogService } from './blogService';

export const useBlogList = () =>
  useQuery({
    queryKey: ['blogs'],
    queryFn: () => blogService.getBlogs(),
  });
```

## blogService.ts (API layer)

```ts
import { fetcher } from '@shop-ban-nick/shared-web'; // or project's shared API path

export const blogService = {
  getBlogs: () => fetcher('/api/blogs'),
  getBlogBySlug: (slug: string) => fetcher(`/api/blogs/${slug}`),
  createBlog: (data: BlogData) =>
    fetcher('/api/blogs', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
```

## BlogContext.tsx (optional)

```tsx
import { createContext, useContext, useState, ReactNode } from 'react';

type BlogContextValue = {
  draft: Record<string, unknown>;
  setDraft: (d: Record<string, unknown>) => void;
};

const BlogContext = createContext<BlogContextValue | null>(null);

export const BlogProvider = ({ children }: { children: ReactNode }) => {
  const [draft, setDraft] = useState({});
  return (
    <BlogContext.Provider value={{ draft, setDraft }}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlogContext = () => {
  const ctx = useContext(BlogContext);
  if (!ctx) throw new Error('useBlogContext must be used within BlogProvider');
  return ctx;
};
```

## apps/web route — app/blog/page.tsx

```tsx
import { BlogList } from '@shop-ban-nick/feature-blog';

export default function Page() {
  return <BlogList />;
}
```

## NX generate (example)

```powershell
nx g @nx/react:lib features/blog --bundler=vite --unitTestRunner=vitest --e2eTestRunner=none --no-interactive
```

## project.json tags

```json
"tags": ["scope:feature", "type:ui"]
```

## tsconfig.base.json path

```json
"@shop-ban-nick/feature-blog": ["libs/features/blog/src/index.ts"]
```
