import { AccountDetailPage } from '@features/account/account-detail-page';

export default async function Page({ params }: { params: Promise<{ slug: string; accountId: string }> }) {
  const { slug, accountId } = await params;
  return <AccountDetailPage slug={slug} accountId={accountId} />;
}
