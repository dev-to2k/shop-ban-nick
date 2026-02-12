'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface AdminAccountsContextValue {
  gameId: string;
  page: number;
  setPage: (v: number) => void;
}

const AdminAccountsContext = createContext<AdminAccountsContextValue | null>(null);

export function useAdminAccountsContext() {
  const ctx = useContext(AdminAccountsContext);
  if (!ctx) throw new Error('useAdminAccountsContext must be used within AdminAccountsProvider');
  return ctx;
}

export function AdminAccountsProvider({ gameId, children }: { gameId: string; children: ReactNode }) {
  const [page, setPageState] = useState(1);

  const setPage = useCallback((v: number) => setPageState(v), []);

  return (
    <AdminAccountsContext.Provider value={{ gameId, page, setPage }}>
      {children}
    </AdminAccountsContext.Provider>
  );
}
