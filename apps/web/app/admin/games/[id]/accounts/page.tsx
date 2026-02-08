import { AdminAccountsProvider } from '@/lib/admin-accounts-context';
import AdminGameAccountsClient from './accounts-client';

export default async function AdminGameAccountsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <AdminAccountsProvider gameId={id}>
      <AdminGameAccountsClient />
    </AdminAccountsProvider>
  );
}
