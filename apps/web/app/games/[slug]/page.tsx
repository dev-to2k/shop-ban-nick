import { GameAccountsPage } from '@shop-ban-nick/feature-account';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <GameAccountsPage slug={slug} />;
}
