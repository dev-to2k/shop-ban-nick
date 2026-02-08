'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Trash2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice } from '@shop-ban-nick/shared-utils';

export interface ProductItemDisplay {
  id: string;
  code: string;
  title: string;
  price: number;
  gameSlug?: string;
  gameName?: string;
  image?: string;
  images?: string[];
  attributes?: Record<string, unknown>;
  tag?: string;
  discount?: number;
}

interface ProductCardProps {
  item: ProductItemDisplay;
  slug?: string;
  variant: 'card' | 'cart';
  onRemove?: (id: string) => void;
}

export function ProductCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <Skeleton className="h-36 w-full mb-3" />
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
    </Card>
  );
}

function priceDisplay(price: number, discount?: number) {
  if (discount && discount > 0) {
    const discounted = Math.round(price * (1 - discount / 100));
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-bold text-primary text-sm">{formatPrice(discounted)}</span>
        <span className="text-xs text-muted-foreground line-through">{formatPrice(price)}</span>
        <Badge variant="destructive" className="text-[10px]">-{discount}%</Badge>
      </div>
    );
  }
  return <span className="font-bold text-primary text-sm">{formatPrice(price)}</span>;
}

export function ProductCard({ item, slug, variant, onRemove }: ProductCardProps) {
  const hrefSlug = slug ?? item.gameSlug ?? '';
  const imgSrc = item.image ?? item.images?.[0];
  const priceEl = priceDisplay(item.price, item.discount);

  if (variant === 'cart') {
    return (
      <Card>
        <CardContent className="p-3 sm:p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex items-center gap-3 min-w-0 sm:flex-1">
            <div className="relative h-16 w-16 sm:h-20 sm:w-20 bg-muted rounded-md flex items-center justify-center shrink-0 overflow-hidden">
              {imgSrc ? (
                <Image src={imgSrc} alt={item.title} width={80} height={80} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-bold text-muted-foreground">{item.code}</span>
              )}
              {item.discount && item.discount > 0 && (
                <Badge variant="destructive" className="absolute top-0 right-0 text-[10px] rounded-none rounded-bl">-{item.discount}%</Badge>
              )}
              {item.tag && (
                <Badge className="absolute bottom-0 left-0 text-[10px] rounded-none rounded-tr">{item.tag}</Badge>
              )}
            </div>
            <div className="flex-1 min-w-0">
              {item.gameName && <p className="text-xs text-muted-foreground truncate">{item.gameName}</p>}
              <h3 className="font-semibold text-sm line-clamp-2 sm:truncate">{item.title}</h3>
              <p className="text-xs text-muted-foreground">Mã: {item.code}</p>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2 sm:justify-end sm:shrink-0">
            <div className="min-w-0">{priceEl}</div>
            {onRemove && (
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-destructive" onClick={() => onRemove(item.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-lg transition-shadow flex flex-col h-full">
      <div className="relative h-40 bg-muted rounded-t-xl flex items-center justify-center overflow-hidden shrink-0">
        {imgSrc ? (
          <Image
            src={imgSrc}
            alt={item.title}
            width={400}
            height={300}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <span className="text-2xl font-bold text-muted-foreground">{item.code}</span>
        )}
        {item.tag && (
          <Badge className="absolute top-2 left-2 text-[10px]">{item.tag}</Badge>
        )}
        {item.discount && item.discount > 0 && (
          <Badge variant="destructive" className="absolute top-2 right-2 text-[10px]">-{item.discount}%</Badge>
        )}
      </div>

      <CardContent className="p-3 flex flex-col flex-1">
        <Link href={`/games/${hrefSlug}/${item.id}`} className="hover:underline">
          <h3 className="font-semibold text-sm line-clamp-2 h-10">{item.title}</h3>
        </Link>
        <p className="text-xs text-muted-foreground mt-1 shrink-0">Mã: {item.code}</p>
        <div className="flex flex-wrap gap-1 mt-2 h-12 overflow-hidden content-start">
          {item.attributes &&
            Object.entries(item.attributes).slice(0, 3).map(([key, val]) => (
              <Badge key={key} variant="secondary" className="text-[10px] h-5">{key}: {String(val)}</Badge>
            ))}
        </div>
      </CardContent>

      <CardFooter className="px-3 py-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mt-auto shrink-0 border-t">
        <div className="min-w-0">{priceEl}</div>
        <Link href={`/games/${hrefSlug}/${item.id}`} className="w-full sm:w-auto shrink-0">
          <Button size="sm" className="w-full sm:w-auto"><ArrowRight className="h-4 w-4 shrink-0 mr-1.5" />Chi tiết</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
