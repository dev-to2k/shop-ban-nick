'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { Home } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './breadcrumb';
import type { BreadcrumbItemType } from '@shared/contexts';

const P = { home: '/', login: '/login', register: '/register', games: '/games', cart: '/cart', checkout: '/checkout', orders: '/orders', profile: '/profile', admin: '/admin' } as const;
const H: BreadcrumbItemType = { label: 'Trang chủ', href: P.home };

type Params = Record<string, string | string[] | undefined>;
const routes: { match: string | ((path: string, q: Params) => boolean); build: (q: Params) => BreadcrumbItemType[] }[] = [
  { match: (p) => p === P.home || !p, build: () => [] },
  { match: P.login, build: () => [H, { label: 'Đăng nhập' }] },
  { match: P.register, build: () => [H, { label: 'Đăng ký' }] },
  { match: P.games, build: () => [H, { label: 'Danh sách game' }] },
  { match: P.cart, build: () => [H, { label: 'Giỏ hàng' }] },
  { match: P.checkout, build: () => [H, { label: 'Giỏ hàng', href: P.cart }, { label: 'Thanh toán' }] },
  { match: P.orders, build: () => [H, { label: 'Đơn hàng' }] },
  { match: P.profile, build: () => [H, { label: 'Tài khoản' }] },
  { match: `${P.profile}/transactions`, build: () => [H, { label: 'Tài khoản', href: P.profile }, { label: 'Lịch sử giao dịch' }] },
  { match: `${P.profile}/wallet`, build: () => [H, { label: 'Tài khoản', href: P.profile }, { label: 'Ví của tôi' }] },
  { match: P.admin, build: () => [H, { label: 'Admin' }] },
  { match: `${P.admin}/orders`, build: () => [H, { label: 'Admin', href: P.admin }, { label: 'Đơn hàng' }] },
  { match: `${P.admin}/games`, build: () => [H, { label: 'Admin', href: P.admin }, { label: 'Games' }] },
  { match: `${P.admin}/games/new`, build: () => [H, { label: 'Admin', href: P.admin }, { label: 'Games', href: `${P.admin}/games` }, { label: 'Thêm game' }] },
  { match: (path, q) => path.startsWith(`${P.games}/`) && !!q['slug'] && !!q['accountId'], build: (q) => [H, { label: 'Danh sách game', href: P.games }, { label: String(q['slug']), href: `${P.games}/${q['slug']}` }, { label: 'Chi tiết' }] },
  { match: (path, q) => path.startsWith(`${P.games}/`) && !!q['slug'], build: (q) => [H, { label: 'Danh sách game', href: P.games }, { label: String(q['slug']) }] },
  { match: (path, q) => path.startsWith(`${P.orders}/`) && !!q['id'], build: (q) => [H, { label: 'Đơn hàng', href: P.orders }, { label: `#${String(q['id']).slice(0, 8)}` }] },
  { match: (path, q) => path.startsWith(`${P.admin}/games/`) && !!q['id'] && path.endsWith('/accounts'), build: (q) => [H, { label: 'Admin', href: P.admin }, { label: 'Games', href: `${P.admin}/games` }, { label: String(q['id']).slice(0, 8), href: `${P.admin}/games/${q['id']}` }, { label: 'Tài khoản' }] },
  { match: (path, q) => path.startsWith(`${P.admin}/games/`) && !!q['id'], build: () => [H, { label: 'Admin', href: P.admin }, { label: 'Games', href: `${P.admin}/games` }, { label: 'Sửa game' }] },
];

function getItemsFromRoute(pathname: string, params: Params): BreadcrumbItemType[] {
  const r = routes.find(({ match }) => (typeof match === 'string' ? pathname === match : match(pathname, params)));
  return r ? r.build(params) : [];
}

function ItemContent({ item }: { item: BreadcrumbItemType }) {
  const showHome = item.href === '/' || (item.label === 'Trang chủ' && item.href == null);
  return (
    <>
      {showHome && <Home className="h-3.5 w-3.5 shrink-0" />}
      <span>{item.label}</span>
    </>
  );
}

export function GlobalBreadcrumb() {
  const pathname = usePathname();
  const params = useParams();
  const items = React.useMemo(() => getItemsFromRoute(pathname ?? '', params ?? {}), [pathname, params]);
  if (!items.length) return null;
  return (
    <div className="sticky top-16 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-narrow py-2">
        <Breadcrumb>
          <BreadcrumbList>
            {items.map((item, i) => (
              <React.Fragment key={i}>
                {i > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {item.href != null ? (
                    <BreadcrumbLink asChild>
                      <Link href={item.href} className="inline-flex items-center gap-1.5">
                        <ItemContent item={item} />
                      </Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage className="inline-flex items-center gap-1.5">
                      <ItemContent item={item} />
                    </BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
}
