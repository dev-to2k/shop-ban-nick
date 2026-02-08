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
import { cn } from '@/lib/utils';

export type BreadcrumbItemType = { label: string; href?: string };

function ItemContent({ item }: { item: BreadcrumbItemType }) {
  const showHome = item.href === '/' || (item.label === 'Trang chủ' && item.href == null);
  return (
    <>
      {showHome && <Home className="h-3.5 w-3.5 shrink-0" />}
      <span>{item.label}</span>
    </>
  );
}

export function PageBreadcrumb({ items, className }: { items: BreadcrumbItemType[]; className?: string }) {
  if (!items.length) return null;
  return (
    <Breadcrumb className={cn('mb-4', className)}>
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
  );
}
