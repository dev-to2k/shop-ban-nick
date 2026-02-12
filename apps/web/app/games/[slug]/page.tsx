import { GameAccountsPage } from '@features/account/game-accounts-page';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <GameAccountsPage slug={slug} />;
}
