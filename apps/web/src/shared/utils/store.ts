'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: any | null;
  token: string | null;
}

interface AppStore {
  auth: AuthState;
  setAuth: (user: any, token: string) => void;
  logout: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      auth: { user: null, token: null },
      setAuth: (user, token) => {
        localStorage.setItem('token', token);
        set({ auth: { user, token } });
      },
      logout: () => {
        localStorage.removeItem('token');
        set({ auth: { user: null, token: null } });
      },
    }),
    { name: 'shop-ban-acc-store' }
  )
);
