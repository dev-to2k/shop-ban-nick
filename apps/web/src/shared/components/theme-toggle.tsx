'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from './button';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <Button variant="ghost" size="icon" aria-label="Toggle theme" />;

  const isDark = resolvedTheme === 'dark';

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="Toggle theme"
    >
      <Sun className={`h-5 w-5 shrink-0 ${isDark ? 'hidden' : 'block'}`} aria-hidden />
      <Moon className={`h-5 w-5 shrink-0 ${isDark ? 'block' : 'hidden'}`} aria-hidden />
    </Button>
  );
}
