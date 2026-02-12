'use client';

export function BannerLoading() {
  return (
    <div className="relative w-full overflow-hidden aspect-[21/9]">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-muted to-primary/10 blur-md scale-110" aria-hidden />
      <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
        <span className="text-white font-medium tracking-wide flex items-center gap-0.5">
          Loading
          <span className="inline-flex gap-0.5" aria-hidden>
            <span className="animate-loading-dot">.</span>
            <span className="animate-loading-dot [animation-delay:0.2s]">.</span>
            <span className="animate-loading-dot [animation-delay:0.4s]">.</span>
          </span>
        </span>
      </div>
    </div>
  );
}
