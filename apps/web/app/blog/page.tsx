import { BlogList } from '@features/blog/blog-list';

export default function BlogPage() {
  return (
    <div className="container-narrow py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
          Tin Tức & Sự Kiện
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Cập nhật thông tin mới nhất về thị trường game, các sự kiện khuyến mãi
          và hướng dẫn bảo mật tài khoản.
        </p>
      </div>
      <BlogList />
    </div>
  );
}
