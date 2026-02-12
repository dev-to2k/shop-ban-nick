export const gameQueryKeys = {
  all: ['games'] as const,
  bySlug: (slug: string) => ['games', slug] as const,
};
