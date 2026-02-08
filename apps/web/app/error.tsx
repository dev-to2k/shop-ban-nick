'use client';

import { Button } from '@shop-ban-nick/shared-web';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <h2 className="text-xl font-semibold">Đã xảy ra lỗi</h2>
        <p className="text-muted-foreground text-sm">
          {process.env.NODE_ENV === 'development' ? error.message : 'Vui lòng thử lại.'}
        </p>
        <Button
          type="button"
          onClick={() => reset()}
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Thử lại
        </Button>
      </div>
    </div>
  );
}
