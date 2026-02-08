'use client';

import { useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { getThemeForSlug } from '@/lib/themes/games';

const THEME_CLASSES = ['theme-neon', 'theme-valorant', 'theme-lol'] as const;

function getSlugFromPathname(pathname: string): string | null {
  if (pathname === '/' || pathname === '/games') return null;
  if (!pathname.startsWith('/games/')) return null;
  const segments = pathname.split('/').filter(Boolean);
  return segments[1] ?? null;
}

export function ThemeClassApplier({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { themePreset, setThemePreset } = useAppStore();

  const slug = useMemo(() => getSlugFromPathname(pathname), [pathname]);
  const gameTheme = useMemo(() => getThemeForSlug(slug), [slug]);
  const effectiveTheme = gameTheme ?? themePreset;

  useEffect(() => {
    if (gameTheme != null) setThemePreset(gameTheme);
  }, [gameTheme, setThemePreset]);

  useEffect(() => {
    const el = document.documentElement;
    el.classList.remove(...THEME_CLASSES);
    if (effectiveTheme !== 'default') {
      el.classList.add(`theme-${effectiveTheme}`);
    }
  }, [effectiveTheme]);

  return <>{children}</>;
}
