'use client';

export function StickyStack({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`sticky top-0 z-50 flex flex-col ${className ?? ''}`.trim()}>
      {children}
    </div>
  );
}
