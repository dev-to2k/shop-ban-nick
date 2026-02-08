import { AccountDetailPage } from '@shop-ban-nick/feature-account';

export default async function Page({ params }: { params: Promise<{ slug: string; accountId: string }> }) {
  const { slug, accountId } = await params;
  return <AccountDetailPage slug={slug} accountId={accountId} />;
}
