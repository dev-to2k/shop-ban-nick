const API_URL = process.env['NEXT_PUBLIC_API_URL'] || 'http://localhost:3001/api';
const API_BASE = API_URL.replace(/\/api\/?$/, '') || 'http://localhost:3001';

export const getApiUrl = () => API_URL;
export const getApiBase = () => API_BASE;

export function getAssetUrl(path: string | null | undefined): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
}

export type ApiFieldError = { field: string; message: string };

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errors: ApiFieldError[] = []
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const errors: ApiFieldError[] = Array.isArray(body.errors) ? body.errors : [];
    const message = (body.message as string) || `Error ${res.status}`;
    const err = new ApiError(message, res.status, errors.length ? errors : [{ field: '_', message }]);
    (err as ApiError & { body?: unknown }).body = body;
    throw err;
  }

  return res.json();
}
