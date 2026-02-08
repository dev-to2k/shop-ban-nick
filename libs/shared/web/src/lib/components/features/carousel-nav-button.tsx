'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils';
import { Button } from '../ui/button';

type Dir = 'prev' | 'next';

interface CarouselNavButtonProps {
  dir: Dir;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
}

const baseClass =
  'absolute top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-md opacity-0 group-hover:opacity-100 hover:bg-primary hover:text-primary-foreground hover:border-primary hover:scale-105 active:scale-95 transition-all duration-200 disabled:pointer-events-none disabled:opacity-50';

export function CarouselNavButton({ dir, onClick, disabled, className, ariaLabel }: CarouselNavButtonProps) {
  const Icon = dir === 'prev' ? ChevronLeft : ChevronRight;
  const defaultLabel = dir === 'prev' ? 'Previous slide' : 'Next slide';
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel ?? defaultLabel}
      className={cn(baseClass, disabled && 'invisible', className)}
    >
      <Icon className="h-5 w-5" />
    </Button>
  );
}

export const carouselNavButtonPositions = {
  banner: { prev: 'left-3', next: 'right-3' },
  inset: { prev: 'left-0 -translate-x-2', next: 'right-0 translate-x-2' },
} as const;
