'use client';

import React from 'react';
import Link from 'next/link';
import { Home } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useBreadcrumb, type BreadcrumbItemType } from '@/lib/breadcrumb-context';

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
  const { items } = useBreadcrumb();
  if (!items.length) return null;
  return (
    <div className="sticky top-16 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-2">
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
