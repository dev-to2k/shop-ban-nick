export const accountQueryKeys = {
  byGame: (slug: string, params?: Record<string, string>) => ['accounts', slug, params] as const,
  byId: (id: string) => ['accounts', id] as const,
};
