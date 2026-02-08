'use client';

import { Search, ArrowDownNarrowWide, ArrowUpNarrowWide, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProduct } from '@/lib/product-context';

export function ProductFilters() {
  const { search, sortBy, sortOrder, setSearch, applySort } = useProduct();

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6 sm:items-stretch">
      <div className="relative flex-1 max-w-sm flex">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Tìm kiếm acc..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="flex items-stretch gap-2">
        <Button
          variant={sortBy === 'price' && sortOrder === 'asc' ? 'default' : 'outline'}
          className="h-(--control-height)"
          onClick={() => applySort('price', 'asc')}
        >
          <ArrowDownNarrowWide className="h-4 w-4 mr-1" />Giá thấp
        </Button>
        <Button
          variant={sortBy === 'price' && sortOrder === 'desc' ? 'default' : 'outline'}
          className="h-(--control-height)"
          onClick={() => applySort('price', 'desc')}
        >
          <ArrowUpNarrowWide className="h-4 w-4 mr-1" />Giá cao
        </Button>
        <Button
          variant={sortBy === 'createdAt' ? 'default' : 'outline'}
          className="h-(--control-height)"
          onClick={() => applySort('createdAt', 'desc')}
        >
          <Clock className="h-4 w-4 mr-1" />Mới nhất
        </Button>
      </div>
    </div>
  );
}
