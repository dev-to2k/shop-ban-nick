import { GameAccountsPage } from '@shop-ban-nick/features-catalog';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <GameAccountsPage slug={slug} />;
}
