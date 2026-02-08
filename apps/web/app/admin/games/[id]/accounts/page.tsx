import { AdminGameAccountsPage } from '@shop-ban-nick/features-admin';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminGameAccountsPage gameId={id} />;
}
