'use client';

import { cn } from '@/lib/utils';

interface FormSubmitErrorProps {
  error: unknown;
  fallbackMessage: string;
  className?: string;
}

export function FormSubmitError({ error, fallbackMessage, className }: FormSubmitErrorProps) {
  if (!error) return null;
  const message = error instanceof Error ? error.message : fallbackMessage;
  return (
    <div
      role="alert"
      className={cn('text-sm text-destructive bg-destructive/10 p-3 rounded-md', className)}
    >
      {message}
    </div>
  );
}
