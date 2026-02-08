export const orderQueryKeys = {
  my: (params?: Record<string, string>) => ['orders', 'my', params] as const,
  byId: (id: string) => ['orders', id] as const,
};
