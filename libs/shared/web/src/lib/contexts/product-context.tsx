'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface ProductContextValue {
  slug: string;
  search: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  page: number;
  setSearch: (v: string) => void;
  setPage: (v: number) => void;
  applySort: (by: string, order: 'asc' | 'desc') => void;
}

const ProductContext = createContext<ProductContextValue | null>(null);

export function useProduct() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error('useProduct must be used within ProductProvider');
  return ctx;
}

export function ProductProvider({ slug, children }: { slug: string; children: ReactNode }) {
  const [search, setSearchState] = useState('');
  const [sortBy, setSortByState] = useState('createdAt');
  const [sortOrder, setSortOrderState] = useState<'asc' | 'desc'>('desc');
  const [page, setPageState] = useState(1);

  const setSearch = useCallback((v: string) => { setSearchState(v); setPageState(1); }, []);
  const setPage = useCallback((v: number) => setPageState(v), []);
  const applySort = useCallback((by: string, order: 'asc' | 'desc') => {
    setSortByState(by);
    setSortOrderState(order);
    setPageState(1);
  }, []);

  return (
    <ProductContext.Provider value={{
      slug,
      search, sortBy, sortOrder, page,
      setSearch, setPage, applySort,
    }}>
      {children}
    </ProductContext.Provider>
  );
}
