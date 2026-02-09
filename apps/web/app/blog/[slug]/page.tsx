import { BlogDetail } from '@shop-ban-nick/feature-blog';

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return (
    <div className="container-narrow py-12">
      <BlogDetail slug={params.slug} />
    </div>
  );
}
