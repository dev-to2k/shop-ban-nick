'use client';

import { useState, useCallback, useMemo } from 'react';

const DEFAULT_MAX = 999_999_999_999;
const THOUSAND_SEP = '.';

export function formatWithSeparator(num: number, sep: string = THOUSAND_SEP): string {
  if (!Number.isFinite(num) || num <= 0) return '';
  const s = String(Math.floor(num));
  const parts: string[] = [];
  for (let i = s.length; i > 0; i -= 3) {
    parts.unshift(s.slice(Math.max(0, i - 3), i));
  }
  return parts.join(sep);
}

function parseDigitsOnly(raw: string): string {
  return raw.replace(/\D/g, '');
}

export interface UseCurrencyInputOptions {
  max?: number;
  initialValue?: number;
}

export function useCurrencyInput(options: UseCurrencyInputOptions = {}) {
  const { max = DEFAULT_MAX, initialValue = 0 } = options;
  const [displayValue, setDisplayValue] = useState(() =>
    initialValue > 0 ? formatWithSeparator(initialValue, THOUSAND_SEP) : ''
  );

  const numericValue = useMemo(() => {
    const digits = parseDigitsOnly(displayValue);
    if (!digits) return 0;
    const n = Math.min(Number(digits), max);
    return n;
  }, [displayValue, max]);

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const digits = parseDigitsOnly(raw);
      if (!digits) {
        setDisplayValue('');
        return;
      }
      const n = Math.min(Number(digits), max);
      setDisplayValue(formatWithSeparator(n, THOUSAND_SEP));
    },
    [max]
  );

  const setValue = useCallback((n: number) => {
    if (!Number.isFinite(n) || n <= 0) {
      setDisplayValue('');
      return;
    }
    setDisplayValue(formatWithSeparator(Math.min(Math.floor(n), max), THOUSAND_SEP));
  }, [max]);

  const clear = useCallback(() => setDisplayValue(''), []);

  const formatPlaceholder = useCallback((n: number) => formatWithSeparator(n, THOUSAND_SEP), []);

  return { value: displayValue, numericValue, onChange, setValue, clear, formatPlaceholder };
}
