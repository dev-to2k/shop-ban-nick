'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Link from 'next/link';
import { useQueries, useQuery } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';
import { CarouselNavButton, carouselNavButtonPositions } from './carousel-nav-button';
import { Button } from './button';
import { api, queryKeys } from '@shared/api';
import type { ProductItemDisplay } from './product-card';
import { ProductCard, ProductCardSkeleton } from './product-card';

type SortConfig = { sortBy: string; sortOrder: 'asc' | 'desc' };

function mapAccountToItem(
  account: { id: string; code: string; title: string; price: number; images?: string[]; attributes?: Record<string, unknown>; tag?: string; discount?: number; game?: { name: string } },
  gameSlug: string,
  gameName?: string
): ProductItemDisplay {
  return {
    id: account.id,
    code: account.code,
    title: account.title,
    price: Number(account.price),
    gameSlug,
    gameName: gameName ?? account.game?.name,
    image: account.images?.[0],
    images: account.images,
    attributes: account.attributes as Record<string, unknown> | undefined,
    tag: account.tag,
    discount: account.discount,
  };
}

type SectionVariant = 'white' | 'slate';

type ProductsCarouselMulti = {
  mode: 'multi';
  title: string;
  linkHref: string;
  linkLabel?: string;
  sort: SortConfig;
  limitPerGame?: number;
  maxGames?: number;
  autoplay?: boolean;
  sectionVariant?: SectionVariant;
};

type ProductsCarouselSingle = {
  mode: 'single';
  title: string;
  linkHref: string;
  linkLabel?: string;
  gameSlug: string;
  gameName?: string;
  sort: SortConfig;
  limit?: number;
  autoplay?: boolean;
  sectionVariant?: SectionVariant;
};

type ProductsCarouselProps = ProductsCarouselMulti | ProductsCarouselSingle;

const SLIDE_CLASS = 'flex-[0_0_min(280px,85vw)] sm:flex-[0_0_min(300px,45vw)] md:flex-[0_0_320px] shrink-0 mx-2';
const SKELETON_COUNT = 6;

const SECTION_SLATE = 'py-16 bg-section-alt';
const SECTION_WHITE = 'py-16';

function ProductsCarouselInner<T extends { item: ProductItemDisplay; slug: string }>(props: {
  title: string;
  linkHref: string;
  linkLabel: string;
  items: T[];
  isLoading: boolean;
  autoplay: boolean;
  sectionVariant?: SectionVariant;
}) {
  const { title, linkHref, linkLabel, items, isLoading, autoplay, sectionVariant = 'slate' } = props;
  const sectionCls = sectionVariant === 'white' ? SECTION_WHITE : SECTION_SLATE;

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      containScroll: 'trimSnaps',
      skipSnaps: false,
    },
    autoplay ? [Autoplay({ delay: 6000, stopOnInteraction: false, stopOnMouseEnter: true })] : []
  );
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setCanPrev(emblaApi.canScrollPrev());
      setCanNext(emblaApi.canScrollNext());
    };
    emblaApi.on('select', onSelect);
    onSelect();
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi]);

  const headingId = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-heading';

  if (isLoading) {
    return (
      <section className={sectionCls} aria-labelledby={headingId}>
        <div className="container-narrow">
          <div className="flex items-center justify-between mb-6">
            <h2 id={headingId} className="text-fluid-section font-bold">
              {title}
            </h2>
            <Link href={props.linkHref}>
              <Button variant="ghost" size="sm">
                {linkLabel} <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="flex overflow-hidden">
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <div key={i} className={SLIDE_CLASS}>
                <ProductCardSkeleton />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <section className={sectionCls} aria-labelledby={headingId}>
      <div className="container-narrow">
        <div className="flex items-center justify-between mb-6">
          <h2 id={headingId} className="text-fluid-section font-bold">
            {title}
          </h2>
          <Link href={linkHref}>
            <Button variant="ghost" size="sm">
              {linkLabel} <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="relative group -mx-4 sm:mx-0">
          <div className="overflow-hidden px-4 sm:px-0" ref={emblaRef}>
            <div className="flex touch-pan-y">
              {items.map(({ item, slug }) => (
                <div key={item.id} className={SLIDE_CLASS}>
                  <ProductCard item={item} slug={slug} variant="card" />
                </div>
              ))}
            </div>
          </div>
          <CarouselNavButton dir="prev" onClick={scrollPrev} disabled={!canPrev} className={carouselNavButtonPositions.inset.prev} />
          <CarouselNavButton dir="next" onClick={scrollNext} disabled={!canNext} className={carouselNavButtonPositions.inset.next} />
        </div>
      </div>
    </section>
  );
}

function ProductsCarouselMulti(props: ProductsCarouselMulti) {
  const limitPerGame = props.limitPerGame ?? 4;
  const maxGames = props.maxGames ?? 6;
  const params = { page: '1', limit: String(limitPerGame), sortBy: props.sort.sortBy, sortOrder: props.sort.sortOrder };

  const { data: games = [], isLoading: gamesLoading } = useQuery({
    queryKey: queryKeys.games.all,
    queryFn: () => api.getGames(),
    staleTime: 60_000,
  });

  const slugs = useMemo(() => games.slice(0, maxGames).map((g) => g.slug), [games, maxGames]);

  const accountQueries = useQueries({
    queries: slugs.map((slug) => ({
      queryKey: queryKeys.accounts.byGame(slug, params),
      queryFn: () => api.getAccountsByGame(slug, params),
      enabled: slugs.length > 0,
      staleTime: 60_000,
    })),
  });

  const items = useMemo(() => {
    const list: { item: ProductItemDisplay; slug: string }[] = [];
    accountQueries.forEach((q, i) => {
      const game = games[i] as { slug: string; name?: string } | undefined;
      if (!game) return;
      const accounts = ((q.data as { data?: unknown[] } | undefined)?.data ?? []) as Parameters<typeof mapAccountToItem>[0][];
      accounts.forEach((acc) => {
        list.push({ item: mapAccountToItem(acc, game.slug, game.name), slug: game.slug });
      });
    });
    return list;
  }, [accountQueries, games]);

  const isLoading = gamesLoading || accountQueries.some((q) => q.isLoading);

  return (
    <ProductsCarouselInner
      title={props.title}
      linkHref={props.linkHref}
      linkLabel={props.linkLabel ?? 'Xem tất cả'}
      items={items}
      isLoading={isLoading}
      autoplay={props.autoplay ?? true}
      sectionVariant={props.sectionVariant}
    />
  );
}

function ProductsCarouselSingle(props: ProductsCarouselSingle) {
  const limit = props.limit ?? 12;
  const params = { page: '1', limit: String(limit), sortBy: props.sort.sortBy, sortOrder: props.sort.sortOrder };

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.accounts.byGame(props.gameSlug, params),
    queryFn: () => api.getAccountsByGame(props.gameSlug, params),
    enabled: !!props.gameSlug,
    staleTime: 60_000,
  });

  const items = useMemo(() => {
    const accounts = ((data as { data?: unknown[] } | undefined)?.data ?? []) as Parameters<typeof mapAccountToItem>[0][];
    return accounts.map((acc) => ({
      item: mapAccountToItem(acc, props.gameSlug, props.gameName),
      slug: props.gameSlug,
    }));
  }, [data, props.gameSlug, props.gameName]);

  return (
    <ProductsCarouselInner
      title={props.title}
      linkHref={props.linkHref}
      linkLabel={props.linkLabel ?? 'Xem tất cả'}
      items={items}
      isLoading={isLoading}
      autoplay={props.autoplay ?? false}
      sectionVariant={props.sectionVariant}
    />
  );
}

export function ProductsCarousel(props: ProductsCarouselProps) {
  if (props.mode === 'multi') {
    return <ProductsCarouselMulti {...props} />;
  }
  return <ProductsCarouselSingle {...props} />;
}

export function DealProductsCarousel({ sectionVariant }: { sectionVariant?: SectionVariant } = {}) {
  return (
    <ProductsCarousel
      mode="multi"
      title="Acc giá tốt"
      linkHref="/games"
      sort={{ sortBy: 'price', sortOrder: 'asc' }}
      limitPerGame={4}
      maxGames={6}
      autoplay={false}
      sectionVariant={sectionVariant}
    />
  );
}

type GameHighlightCarouselProps = {
  gameSlug: string;
  gameName: string;
  sectionVariant?: SectionVariant;
};

export function GameHighlightCarousel({ gameSlug, gameName, sectionVariant }: GameHighlightCarouselProps) {
  return (
    <ProductsCarousel
      mode="single"
      title={`${gameName} nổi bật`}
      linkHref={`/games/${gameSlug}`}
      gameSlug={gameSlug}
      gameName={gameName}
      sort={{ sortBy: 'createdAt', sortOrder: 'desc' }}
      limit={12}
      autoplay={false}
      sectionVariant={sectionVariant}
    />
  );
}

const FEATURED_GAME_SLUG = typeof process !== 'undefined' ? process.env['NEXT_PUBLIC_FEATURED_GAME_SLUG'] ?? '' : '';

export function FirstGameCarousel({ sectionVariant }: { sectionVariant?: SectionVariant } = {}) {
  const { data: games = [] } = useQuery({
    queryKey: queryKeys.games.all,
    queryFn: () => api.getGames(),
    staleTime: 60_000,
  });
  const list = games as { slug: string; name?: string }[];
  const first = FEATURED_GAME_SLUG
    ? list.find((g) => g.slug === FEATURED_GAME_SLUG) ?? list[0]
    : list[0];
  if (!first) return null;
  return <GameHighlightCarousel gameSlug={first.slug} gameName={first.name ?? first.slug} sectionVariant={sectionVariant} />;
}
