'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { toast } from 'sonner';
import { ShoppingCart, Check, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { LazyImage, Button, Card, CardContent, CardHeader, CardTitle, Badge, Separator, Skeleton, api, queryKeys, useCart, useBreadcrumb } from '@shop-ban-nick/shared-web';
import { formatPrice } from '@shop-ban-nick/shared-utils';
import type { IGameAccount } from '@shop-ban-nick/shared-types';

export function AccountDetailPage({ slug, accountId }: { slug: string; accountId: string }) {
  const router = useRouter();
  const { addToCart, isInCart } = useCart();
  const { setItems: setBreadcrumb } = useBreadcrumb();
  const [currentImage, setCurrentImage] = useState(0);

  const { data: account, isLoading } = useQuery({
    queryKey: queryKeys.accounts.byId(accountId),
    queryFn: () => api.getAccountById(accountId),
  });

  useEffect(() => {
    if (account) {
      const gameName = account.game?.name ?? 'Game';
      setBreadcrumb([{ label: 'Trang chủ', href: '/' }, { label: 'Danh sách game', href: '/games' }, { label: gameName, href: `/games/${slug}` }, { label: account.title }]);
    }
    return () => setBreadcrumb([]);
  }, [account, slug, setBreadcrumb]);

  if (isLoading) {
    return (
      <div className="container-narrow py-6 sm:py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="h-96 w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!account) {
    return <div className="container-narrow py-16 sm:py-20 text-center text-muted-foreground">Acc không tồn tại</div>;
  }

  const images = account.images?.length > 0 ? account.images : [];
  const ext = account as IGameAccount & { tag?: string; discount?: number };

  const handleAddToCart = () => {
    addToCart({
      id: account.id,
      code: account.code,
      title: account.title,
      price: Number(account.price),
      gameSlug: slug,
      gameName: account.game?.name || '',
      image: images[0],
      tag: ext.tag,
      discount: ext.discount,
    });
    toast.success('Đã thêm vào giỏ hàng', { description: account.title });
  };

  return (
    <div className="container-narrow py-6 sm:py-8">
      <Button variant="ghost" size="sm" className="mb-4" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4 mr-1" /> Quay lại
      </Button>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="relative h-80 md:h-96 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
            {images.length > 0 ? (
              <>
                <Image src={images[currentImage]} alt={account.title} width={800} height={600} className="w-full h-full object-contain" />
                {images.length > 1 && (
                  <>
                    <Button size="icon" variant="ghost" className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80" onClick={() => setCurrentImage((p) => (p - 1 + images.length) % images.length)}>
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80" onClick={() => setCurrentImage((p) => (p + 1) % images.length)}>
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </>
                )}
              </>
            ) : (
              <span className="text-4xl font-bold text-muted-foreground">{account.code}</span>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto">
              {images.map((img: string, i: number) => (
                <Button key={i} onClick={() => setCurrentImage(i)} className={`relative h-16 w-16 rounded-md overflow-hidden border-2 shrink-0 ${i === currentImage ? 'border-primary' : 'border-transparent'}`}>
                  <LazyImage src={img} alt="" width={64} height={64} className="w-full h-full object-cover" placeholderClassName="relative h-16 w-16" />
                </Button>
              ))}
            </div>
          )}
        </div>

        <div>
          <Badge variant="secondary">{account.game?.name}</Badge>
          <h1 className="text-2xl font-bold mt-2">{account.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">Mã: {account.code}</p>
          <div className="text-3xl font-bold text-primary mt-4 tabular-nums">{formatPrice(Number(account.price))}</div>
          <Separator className="my-4" />
          {account.attributes && Object.keys(account.attributes).length > 0 && (
            <Card className="mb-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Thông tin chi tiết</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(account.attributes as Record<string, unknown>).map(([key, val]) => (
                    <div key={key} className="flex justify-between text-sm py-1.5 border-b last:border-0">
                      <span className="text-muted-foreground">{key}</span>
                      <span className="font-medium">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          {account.description && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Mô tả</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{account.description}</p>
            </div>
          )}
          <Button className="w-full" size="lg" disabled={isInCart(account.id)} onClick={handleAddToCart}>
            {isInCart(account.id) ? <><Check className="h-5 w-5 mr-2" /> Đã thêm vào giỏ</> : <><ShoppingCart className="h-5 w-5 mr-2" /> Thêm vào giỏ hàng</>}
          </Button>
        </div>
      </div>
    </div>
  );
}
