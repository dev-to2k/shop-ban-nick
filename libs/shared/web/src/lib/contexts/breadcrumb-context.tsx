'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type BreadcrumbItemType = { label: string; href?: string };

type BreadcrumbContextValue = {
  items: BreadcrumbItemType[];
  setItems: (items: BreadcrumbItemType[]) => void;
};

const BreadcrumbContext = createContext<BreadcrumbContextValue | null>(null);

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BreadcrumbItemType[]>([]);
  const setItemsStable = useCallback((next: BreadcrumbItemType[]) => setItems(next), []);
  return (
    <BreadcrumbContext.Provider value={{ items, setItems: setItemsStable }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumb() {
  const ctx = useContext(BreadcrumbContext);
  if (!ctx) throw new Error('useBreadcrumb must be used within BreadcrumbProvider');
  return ctx;
}
