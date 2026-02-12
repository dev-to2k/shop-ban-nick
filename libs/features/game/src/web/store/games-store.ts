import { create } from 'zustand';

interface GamesStore {
  selectedSlug: string | null;
  setSelectedSlug: (slug: string | null) => void;
}

export const useGamesStore = create<GamesStore>((set) => ({
  selectedSlug: null,
  setSelectedSlug: (slug) => set({ selectedSlug: slug }),
}));
