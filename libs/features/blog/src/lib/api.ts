import { BlogPost } from './blog-card';

const MOCK_BLOGS: BlogPost[] = [
  {
    id: '1',
    title: 'Top 5 Game Hot Nhất 2026',
    slug: 'top-5-game-hot-2026',
    excerpt:
      'Khám phá danh sách các tựa game đang làm mưa làm gió trên thị trường với cộng đồng người chơi đông đảo.',
    thumbnail:
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=2670',
    content: `
      <h2>1. Game A</h2>
      <p>Mô tả game A...</p>
      <h2>2. Game B</h2>
      <p>Mô tả game B...</p>
    `,
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
    content: '<p>Nội dung hướng dẫn...</p>',
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
    content: '<p>Chi tiết sự kiện...</p>',
    author: 'Marketing',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

export const blogApi = {
  getBlogs: async () => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return MOCK_BLOGS;
  },
  getBlogBySlug: async (slug: string) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return MOCK_BLOGS.find((b) => b.slug === slug);
  },
  // Admin methods
  deleteBlog: async (id: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return true;
  },
  createBlog: async (data: any) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return {
      ...data,
      id: Math.random().toString(),
      createdAt: new Date().toISOString(),
    };
  },
  updateBlog: async (id: string, data: any) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { ...data, id };
  },
};
