import { AdminGameEditPage } from '@shop-ban-nick/feature-game';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminGameEditPage gameId={id} />;
}
