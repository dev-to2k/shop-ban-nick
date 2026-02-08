'use client';

import { useState } from 'react';
import Image from 'next/image';
import { LazyImage } from '@/components/ui/lazy-image';
import { cn } from '@/lib/utils';

const DEFAULT_SIZES = '(max-width: 30em) 50vw, (max-width: 48em) 33vw, (max-width: 62em) 25vw, 20vw';

export interface CardImageProps {
  src: string;
  alt: string;
  /** Wrapper: aspect ratio + layout. Default aspect-4/3. */
  wrapperClassName?: string;
  /** Image: object-cover, scale, etc. */
  imageClassName?: string;
  sizes?: string;
  lazy?: boolean;
  priority?: boolean;
  unoptimized?: boolean;
  fallback?: React.ReactNode;
  onError?: () => void;
}

export function CardImage({
  src,
  alt,
  wrapperClassName = 'relative w-full max-w-full min-w-0 aspect-[4/3] min-h-40 overflow-hidden bg-card box-border block p-0',
  imageClassName = 'object-cover object-center',
  sizes = DEFAULT_SIZES,
  lazy = true,
  priority = false,
  unoptimized = false,
  fallback = null,
  onError,
}: CardImageProps) {
  const [error, setError] = useState(false);
  const handleError = () => {
    setError(true);
    onError?.();
  };

  const imageProps = {
    src,
    alt,
    fill: true as const,
    sizes,
    unoptimized,
    onError: handleError,
    className: imageClassName,
    ...(priority && { priority }),
  };

  const wrapperCls = cn('box-border p-0', wrapperClassName);
  const innerCls = 'absolute inset-0 w-full h-full min-w-0 min-h-0 relative';

  if (!src || error) {
    return <div className={wrapperCls}>{fallback}</div>;
  }

  if (lazy && !priority) {
    return (
      <div className={wrapperCls}>
        <LazyImage {...imageProps} placeholderClassName={innerCls} />
      </div>
    );
  }

  return (
    <div className={wrapperCls}>
      <Image {...imageProps} />
    </div>
  );
}
