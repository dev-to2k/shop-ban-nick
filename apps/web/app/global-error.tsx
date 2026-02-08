'use client';

import { Button } from "@shop-ban-nick/shared-web";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground font-sans antialiased p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <h1 className="text-2xl font-semibold">Đã xảy ra lỗi</h1>
          <p className="text-muted-foreground text-sm">
            {process.env.NODE_ENV === 'development' ? error.message : 'Vui lòng thử lại sau.'}
          </p>
          <Button
            type="button"
            onClick={() => reset()}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Thử lại
          </Button>
        </div>
      </body>
    </html>
  );
}
