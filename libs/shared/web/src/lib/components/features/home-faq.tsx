'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';

export function HomeFaq({ items }: { items: { q: string; a: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <div className="max-w-2xl mx-auto space-y-2">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i} className="border rounded-lg bg-background overflow-hidden">
            <Button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${i}`}
              id={`faq-question-${i}`}
              className="w-full flex items-center justify-between gap-4 px-4 py-3 text-left font-medium hover:bg-muted/50 transition-colors"
            >
              {item.q}
              <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </Button>
            <div
              id={`faq-answer-${i}`}
              role="region"
              aria-labelledby={`faq-question-${i}`}
              className={`border-t overflow-hidden transition-[height] duration-200 ${isOpen ? 'visible' : 'hidden'}`}
            >
              <p className="px-4 py-3 text-sm text-muted-foreground">{item.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
