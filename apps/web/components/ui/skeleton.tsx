'use client';

import { useState, useEffect } from 'react';
import RSkeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

const theme = {
  light: { base: '#e5e7eb', highlight: '#f3f4f6' },
  dark: { base: '#374151', highlight: '#4b5563' },
};

function Skeleton({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof RSkeleton>) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const colors = !mounted ? theme.light : (resolvedTheme === 'dark' ? theme.dark : theme.light);
  return (
    <SkeletonTheme baseColor={colors.base} highlightColor={colors.highlight}>
      <RSkeleton
        className={cn(className)}
        containerClassName={containerClassName}
        duration={1.2}
        {...props}
      />
    </SkeletonTheme>
  );
}

export { Skeleton };
