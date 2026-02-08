import AccountDetailClient from './account-detail-client';

export default async function AccountDetailPage({ params }: { params: Promise<{ slug: string; accountId: string }> }) {
  const { slug, accountId } = await params;
  return <AccountDetailClient slug={slug} accountId={accountId} />;
}
