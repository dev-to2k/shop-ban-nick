import EditGameClient from './edit-game-client';

export default async function EditGamePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditGameClient gameId={id} />;
}
