import type { ThemePreset } from '@/lib/store';
import * as valorant from './valorant';
import * as lienQuan from './lien-quan-mobile';
import * as genshin from './genshin-impact';
import * as freeFire from './free-fire';
import * as pubg from './pubg-mobile';
import * as crossfire from './crossfire';
import * as dotKich from './dot-kich';

const GAMES = [
  valorant,
  lienQuan,
  genshin,
  freeFire,
  pubg,
  crossfire,
  dotKich,
] as const;

const SLUG_MAP = new Map<string, ThemePreset>(
  GAMES.map((g) => [g.slug, g.themeId])
);

export function getThemeForSlug(slug: string | null): ThemePreset | null {
  if (!slug) return null;
  const theme = SLUG_MAP.get(slug);
  return theme ?? null;
}
