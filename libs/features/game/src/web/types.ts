export type GamesListVariant = 'preview' | 'full';
export type SectionVariant = 'white' | 'slate';

export interface GameWithCount {
  id: string;
  name: string;
  slug: string;
  thumbnail?: string | null;
  description?: string | null;
  _count?: { accounts: number };
}

export interface GamesSectionContextValue {
  games: GameWithCount[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  variant: GamesListVariant;
  sectionVariant: SectionVariant;
}
