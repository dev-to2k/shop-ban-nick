'use client';

import { Search, ArrowDownNarrowWide, ArrowUpNarrowWide, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useProduct } from '../../contexts';

export function ProductFilters() {
  const { search, sortBy, sortOrder, setSearch, applySort } = useProduct();

  return (
    <section className="mb-6 w-full min-w-0 overflow-hidden" aria-label="Bộ lọc">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full min-w-0 sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Tìm kiếm acc..."
            className="pl-9 h-9 w-full min-w-0"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 min-w-0 shrink-0">
        <Button
          variant={sortBy === 'price' && sortOrder === 'asc' ? 'default' : 'outline'}
          size="sm"
          className="h-9 shrink-0"
          onClick={() => applySort('price', 'asc')}
        >
          <ArrowDownNarrowWide className="h-4 w-4 mr-1" />Giá thấp
        </Button>
        <Button
          variant={sortBy === 'price' && sortOrder === 'desc' ? 'default' : 'outline'}
          size="sm"
          className="h-9 shrink-0"
          onClick={() => applySort('price', 'desc')}
        >
          <ArrowUpNarrowWide className="h-4 w-4 mr-1" />Giá cao
        </Button>
        <Button
          variant={sortBy === 'createdAt' ? 'default' : 'outline'}
          size="sm"
          className="h-9 shrink-0"
          onClick={() => applySort('createdAt', 'desc')}
        >
          <Clock className="h-4 w-4 mr-1" />Mới nhất
        </Button>
      </div>
      </div>
    </section>
  );
}
