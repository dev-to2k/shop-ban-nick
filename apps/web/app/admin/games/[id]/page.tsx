import { AdminGameEditPage } from '@features/game/admin-game-edit-page';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminGameEditPage gameId={id} />;
}
