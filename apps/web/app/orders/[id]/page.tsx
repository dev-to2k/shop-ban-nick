import { OrderDetailPage } from '@shop-ban-nick/feature-order';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OrderDetailPage id={id} />;
}
