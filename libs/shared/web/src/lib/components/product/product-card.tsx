'use client';

import { formatPrice } from '@shop-ban-nick/shared-utils';
import { ArrowRight, Minus, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '../../contexts';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter } from '../ui/card';
import { CardImage } from '../ui/card-image';
import { Skeleton } from '../ui/skeleton';

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
  quantity?: number;
  onRemove?: (id: string) => void;
}

export function ProductCardSkeleton() {
  return (
    <Card className="flex flex-col h-full overflow-hidden">
      <div className="w-full aspect-4/3 min-h-40 shrink-0 rounded-none rounded-t-xl overflow-hidden">
        <Skeleton className="h-full w-full rounded-none" />
      </div>
      <CardContent className="p-3 flex flex-col flex-1">
        <Skeleton className="h-4 w-full mb-2 rounded" />
        <Skeleton className="h-4 w-[85%] mb-3 rounded" />
        <Skeleton className="h-3 w-20 mb-2 rounded" />
        <div className="flex gap-1.5 mt-2 flex-wrap">
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
      </CardContent>
      <CardFooter className="px-3 py-2 flex items-center justify-between gap-2 border-t shrink-0">
        <Skeleton className="h-5 w-24 rounded" />
        <Skeleton className="h-9 w-full sm:w-24 rounded-md" />
      </CardFooter>
    </Card>
  );
}

function priceDisplay(price: number, discount?: number) {
  if (discount && discount > 0) {
    const discounted = Math.round(price * (1 - discount / 100));
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-bold text-primary text-sm tabular-nums">
          {formatPrice(discounted)}
        </span>
        <span className="text-xs text-muted-foreground line-through tabular-nums">
          {formatPrice(price)}
        </span>
        <Badge variant="destructive" className="text-[0.625rem]">
          -{discount}%
        </Badge>
      </div>
    );
  }
  return (
    <span className="font-bold text-primary text-sm tabular-nums">
      {formatPrice(price)}
    </span>
  );
}

export function ProductCard({
  item,
  slug,
  variant,
  quantity = 1,
  onRemove,
}: ProductCardProps) {
  const cart = useCart();
  const hrefSlug = slug ?? item.gameSlug ?? '';
  const imgSrc = item.image ?? item.images?.[0];
  const priceEl = priceDisplay(item.price, item.discount);
  const qty = variant === 'cart' ? quantity : 1;
  const unitPrice =
    item.discount && item.discount > 0
      ? Math.round(item.price * (1 - item.discount / 100))
      : item.price;
  const lineTotal = unitPrice * qty;

  if (variant === 'cart') {
    const { updateCartQuantity, removeFromCart } = cart;
    return (
      <Card>
        <CardContent className="p-3 sm:p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex items-center gap-3 min-w-0 sm:flex-1">
            <div className="relative aspect-square w-16 sm:w-20 bg-muted rounded-md shrink-0 overflow-hidden flex items-center justify-center">
              {imgSrc ? (
                <CardImage
                  src={imgSrc}
                  alt={item.title}
                  wrapperClassName="absolute inset-0"
                  imageClassName="object-cover object-center w-full h-full"
                  sizes="5rem"
                  lazy={false}
                />
              ) : (
                <span className="text-xs font-bold text-muted-foreground">
                  {item.code}
                </span>
              )}
              {item.discount && item.discount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute top-0 right-0 text-[0.625rem] rounded-none rounded-bl"
                >
                  -{item.discount}%
                </Badge>
              )}
              {item.tag && (
                <Badge className="absolute bottom-0 left-0 text-[0.625rem] rounded-none rounded-tr">
                  {item.tag}
                </Badge>
              )}
            </div>
            <div className="flex-1 min-w-0">
              {item.gameName && (
                <p className="text-xs text-muted-foreground truncate">
                  {item.gameName}
                </p>
              )}
              <h3 className="font-semibold text-sm line-clamp-2 sm:truncate">
                {item.title}
              </h3>
              <p className="text-xs text-muted-foreground">Mã: {item.code}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 shrink-0">
            <div className="flex items-center gap-1 border rounded-md w-fit">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={() =>
                  updateCartQuantity(item.id, Math.max(1, qty - 1))
                }
                aria-label="Giảm số lượng"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span
                className="min-w-[2ch] text-center text-sm font-medium tabular-nums"
                aria-live="polite"
              >
                {qty}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={() => updateCartQuantity(item.id, qty + 1)}
                aria-label="Tăng số lượng"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between gap-2 sm:justify-end">
              <div className="min-w-0">
                {qty > 1 ? (
                  <div className="flex flex-col">
                    <span className="font-bold text-primary text-sm tabular-nums">
                      {formatPrice(lineTotal)}
                    </span>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {formatPrice(unitPrice)} × {qty}
                    </span>
                  </div>
                ) : (
                  priceEl
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 text-destructive"
                onClick={() =>
                  onRemove ? onRemove(item.id) : removeFromCart(item.id)
                }
                aria-label="Xóa khỏi giỏ"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full min-w-0">
      <div className="relative w-full shrink-0 overflow-hidden rounded-t-xl">
        {imgSrc ? (
          <CardImage
            src={imgSrc}
            alt={item.title}
            wrapperClassName="relative w-full max-w-full min-w-0 aspect-4/3 min-h-40 overflow-hidden bg-card rounded-none p-0"
            imageClassName="object-cover object-center group-hover:scale-105 transition-transform"
            sizes="(max-width: 30em) 50vw, (max-width: 48em) 33vw, (max-width: 62em) 25vw, 20vw"
            fallback={
              <span className="text-2xl font-bold text-muted-foreground">
                {item.code}
              </span>
            }
          />
        ) : (
          <div className="relative w-full aspect-4/3 min-h-40 bg-card flex items-center justify-center">
            <span className="text-2xl font-bold text-muted-foreground">
              {item.code}
            </span>
          </div>
        )}
        {item.tag && (
          <Badge className="absolute top-2 left-2 z-10 text-[0.625rem]">
            {item.tag}
          </Badge>
        )}
        {item.discount && item.discount > 0 && (
          <Badge
            variant="destructive"
            className="absolute top-2 right-2 z-10 text-[0.625rem]"
          >
            -{item.discount}%
          </Badge>
        )}
      </div>

      <CardContent className="p-3 flex flex-col flex-1">
        <Link
          href={`/games/${hrefSlug}/${item.id}`}
          className="hover:underline"
        >
          <h3 className="font-semibold text-sm line-clamp-2 min-h-10">
            {item.title}
          </h3>
        </Link>
        <p className="text-xs text-muted-foreground mt-1 shrink-0">
          Mã: {item.code}
        </p>
        <div className="flex flex-wrap gap-1 mt-2 min-h-12 overflow-hidden content-start">
          {item.attributes &&
            Object.entries(item.attributes)
              .slice(0, 3)
              .map(([key, val]) => (
                <Badge
                  key={key}
                  variant="secondary"
                  className="text-[0.625rem] h-5"
                >
                  {key}: {String(val)}
                </Badge>
              ))}
        </div>
      </CardContent>

      <CardFooter className="px-3 py-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mt-auto shrink-0 border-t">
        <div className="min-w-0">{priceEl}</div>
        <Link
          href={`/games/${hrefSlug}/${item.id}`}
          className="w-full sm:w-auto shrink-0"
        >
          <Button size="sm" className="w-full sm:w-auto">
            <ArrowRight className="h-4 w-4 shrink-0 mr-1.5" />
            Chi tiết
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
