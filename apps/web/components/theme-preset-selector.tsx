'use client';

import { useState, useRef, useEffect } from 'react';
import { Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore, type ThemePreset } from '@/lib/store';
import { withThemeTransition } from '@/lib/theme-transition';

const PRESETS: { id: ThemePreset; label: string; colors: [string, string] }[] = [
  { id: 'default', label: 'Mặc định', colors: ['#18181b', '#f4f4f5'] },
  { id: 'neon', label: 'Neon', colors: ['#a855f7', '#22d3ee'] },
  { id: 'valorant', label: 'Valorant', colors: ['#ef4444', '#2dd4bf'] },
  { id: 'lol', label: 'LoL', colors: ['#eab308', '#6366f1'] },
];

export function ThemePresetSelector() {
  const { themePreset, setThemePreset } = useAppStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(!open)}
        aria-label="Theme preset"
      >
        <Palette className="h-5 w-5" />
      </Button>

      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 rounded-lg border bg-popover p-2 shadow-lg min-w-[160px] flex flex-col gap-1">
          <p className="text-xs font-medium text-muted-foreground px-2 pb-1.5">Theme</p>
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => { withThemeTransition(() => setThemePreset(p.id)); setOpen(false); }}
              className={`flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent ${
                themePreset === p.id ? 'bg-accent font-medium' : ''
              }`}
            >
              <span className="flex gap-0.5">
                <span className="h-4 w-4 rounded-full border" style={{ background: p.colors[0] }} />
                <span className="h-4 w-4 rounded-full border -ml-1.5" style={{ background: p.colors[1] }} />
              </span>
              <span>{p.label}</span>
              {themePreset === p.id && <span className="ml-auto text-primary text-xs">&#10003;</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
