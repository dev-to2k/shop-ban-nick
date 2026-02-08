'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  code: string;
  title: string;
  price: number;
  gameSlug: string;
  gameName: string;
  image?: string;
  tag?: string;
  discount?: number;
}

interface AuthState {
  user: any | null;
  token: string | null;
}

export type ThemePreset = 'default' | 'neon' | 'valorant' | 'lol';

interface AppStore {
  // Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  isInCart: (id: string) => boolean;

  // Auth
  auth: AuthState;
  setAuth: (user: any, token: string) => void;
  logout: () => void;

  // Theme preset
  themePreset: ThemePreset;
  setThemePreset: (preset: ThemePreset) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Cart
      cart: [],
      addToCart: (item) => {
        const exists = get().cart.find((i) => i.id === item.id);
        if (!exists) set({ cart: [...get().cart, item] });
      },
      removeFromCart: (id) => set({ cart: get().cart.filter((i) => i.id !== id) }),
      clearCart: () => set({ cart: [] }),
      isInCart: (id) => get().cart.some((i) => i.id === id),

      // Auth
      auth: { user: null, token: null },
      setAuth: (user, token) => {
        localStorage.setItem('token', token);
        set({ auth: { user, token } });
      },
      logout: () => {
        localStorage.removeItem('token');
        set({ auth: { user: null, token: null } });
      },

      // Theme preset
      themePreset: 'default',
      setThemePreset: (preset) => set({ themePreset: preset }),
    }),
    { name: 'shop-ban-acc-store' }
  )
);
