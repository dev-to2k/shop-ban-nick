import { AdminGameAccountsPage } from '@features/account/admin-game-accounts-page';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminGameAccountsPage gameId={id} />;
}
