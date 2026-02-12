import { BlogDetail } from '@features/blog/blog-detail';

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return (
    <div className="container-narrow py-12">
      <BlogDetail slug={params.slug} />
    </div>
  );
}
