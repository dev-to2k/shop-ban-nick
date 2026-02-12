import { create } from 'zustand';

interface BannerStore {
  activeIndex: number;
  isPaused: boolean;
  setActiveIndex: (i: number) => void;
  setPaused: (p: boolean) => void;
}

export const useBannerStore = create<BannerStore>((set) => ({
  activeIndex: 0,
  isPaused: false,
  setActiveIndex: (i) => set({ activeIndex: i }),
  setPaused: (p) => set({ isPaused: p }),
}));
