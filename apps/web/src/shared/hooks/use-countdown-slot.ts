'use client';

import { useEffect, useRef, useState } from 'react';

export const SLOT_ROW_HEIGHT_REM = 1.75;
export const SLOT_DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
export const SLOT_LIST = [...SLOT_DIGITS, ...SLOT_DIGITS];

export function useSlotDigit(value: number) {
  const v = Math.max(0, Math.min(9, value));
  const prevRef = useRef(v);
  const targetIndexRef = useRef(v);
  const [noTransition, setNoTransition] = useState(false);
  const prev = prevRef.current;
  if (v !== prev) {
    const inSecond = targetIndexRef.current >= 10;
    targetIndexRef.current = v > prev ? (inSecond ? 10 + v : v) : 10 + v;
    prevRef.current = v;
  }
  const targetIndex = targetIndexRef.current;
  const inSecondCopy = targetIndex >= 10;
  useEffect(() => {
    if (!inSecondCopy) return;
    const t = setTimeout(() => {
      targetIndexRef.current = v;
      prevRef.current = v;
      setNoTransition(true);
      requestAnimationFrame(() => setNoTransition(false));
    }, 360);
    return () => clearTimeout(t);
  }, [inSecondCopy, v]);
  return { targetIndex, noTransition };
}

export function padZero(n: number, length = 2): string {
  return n.toString().padStart(length, '0');
}
