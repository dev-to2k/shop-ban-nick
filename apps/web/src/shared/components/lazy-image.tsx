'use client';

import { useRef, useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { Skeleton } from './skeleton';

const DEFAULT_ROOT_MARGIN = '100px';
const DEFAULT_THRESHOLD = 0.01;

export interface LazyImageProps extends Omit<ImageProps, 'onLoad'> {
  rootMargin?: string;
  threshold?: number;
  placeholderClassName?: string;
  onLoad?: ImageProps['onLoad'];
}

export function LazyImage({
  src,
  alt,
  rootMargin = DEFAULT_ROOT_MARGIN,
  threshold = DEFAULT_THRESHOLD,
  placeholderClassName,
  className,
  onLoad,
  ...rest
}: LazyImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setInView(true);
      },
      { rootMargin, threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, threshold]);

  const handleLoad: ImageProps['onLoad'] = (e) => {
    setLoaded(true);
    onLoad?.(e);
  };

  const wrapperClassName = placeholderClassName ?? 'relative w-full h-full min-h-[10rem]';
  return (
    <div ref={ref} className={wrapperClassName}>
      {(!inView || !loaded) && <Skeleton className="absolute inset-0 w-full h-full" />}
      {inView && (
        <Image
          src={src}
          alt={alt}
          className={className}
          loading="lazy"
          onLoad={handleLoad}
          {...rest}
          style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.2s ease-in-out', ...rest.style }}
        />
      )}
    </div>
  );
}
