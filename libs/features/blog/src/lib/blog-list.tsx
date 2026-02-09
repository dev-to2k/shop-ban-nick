'use client';

import { Skeleton } from '@shop-ban-nick/shared-web';
import { useQuery } from '@tanstack/react-query';
import { BlogCard, BlogPost } from './blog-card';

// Mock API function (replace with real API call)
const fetchBlogs = async (): Promise<BlogPost[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return [
    {
      id: '1',
      title: 'Top 5 Game Hot Nhất 2026',
      slug: 'top-5-game-hot-2026',
      excerpt:
        'Khám phá danh sách các tựa game đang làm mưa làm gió trên thị trường với cộng đồng người chơi đông đảo.',
      thumbnail:
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=2670',
      author: 'Admin',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Hướng Dẫn Mua Acc An Toàn',
      slug: 'huong-dan-mua-acc-an-toan',
      excerpt:
        'Những lưu ý quan trọng khi giao dịch mua bán tài khoản game để tránh bị lừa đảo.',
      thumbnail:
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=2670',
      author: 'Support',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: '3',
      title: 'Sự Kiện Flash Sale Cuối Tuần',
      slug: 'flash-sale-cuoi-tuan',
      excerpt:
        'Săn deal giá hời với hàng ngàn tài khoản giảm giá lên đến 50% chỉ trong 2 ngày cuối tuần.',
      thumbnail:
        'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=2642',
      author: 'Marketing',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
  ];
};

export function BlogList() {
  const { data: blogs, isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: fetchBlogs,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {blogs?.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
}
