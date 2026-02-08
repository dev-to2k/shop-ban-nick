import { getApiUrl } from '../core';

type GameRow = { _count?: { accounts: number } };

export async function getGamesServer(): Promise<GameRow[]> {
  const API_URL = getApiUrl();
  try {
    const res = await fetch(`${API_URL}/games`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}
