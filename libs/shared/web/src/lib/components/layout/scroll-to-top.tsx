'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronUp } from 'lucide-react';
import { Button } from '../ui/button';

const SCROLL_THRESHOLD = 300;
const OPACITY_SCROLL_RANGE = 200;

export function ScrollToTop() {
  const [opacity, setOpacity] = useState(0);

  const onScroll = useCallback(() => {
    const y = typeof window === 'undefined' ? 0 : window.scrollY;
    if (y <= SCROLL_THRESHOLD) {
      setOpacity(0);
    } else {
      const progress = Math.min(1, (y - SCROLL_THRESHOLD) / OPACITY_SCROLL_RANGE);
      setOpacity(progress);
    }
  }, []);

  useEffect(() => {
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [onScroll]);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="Scroll to top"
      onClick={scrollTop}
      className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg transition-opacity duration-200 border-border bg-background hover:bg-accent"
      style={{ opacity, pointerEvents: opacity > 0 ? 'auto' : 'none' }}
    >
      <ChevronUp className="h-5 w-5" />
    </Button>
  );
}
