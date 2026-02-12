'use client';

import { useSlotDigit, SLOT_LIST, SLOT_ROW_HEIGHT_REM, padZero } from '@shared/hooks/use-countdown-slot';

export interface SlotDigitProps {
  value: number;
  className?: string;
  rowClassName?: string;
  rowHeightRem?: number;
}

export function SlotDigit({
  value,
  className,
  rowClassName,
  rowHeightRem = SLOT_ROW_HEIGHT_REM,
}: SlotDigitProps) {
  const { targetIndex, noTransition } = useSlotDigit(value);
  const transitionClass =
    noTransition ? '' : 'transition-transform duration-[var(--countdown-slot-duration)] ease-[var(--countdown-slot-ease)]';
  return (
    <span
      className={
        className ??
        'relative inline-block h-7 min-w-[1ch] overflow-hidden text-center leading-7'
      }
    >
      <span
        className={`flex flex-col ${transitionClass}`}
        style={{
          transform: `translate3d(0, -${targetIndex * rowHeightRem}rem, 0)`,
        }}
      >
        {SLOT_LIST.map((d, i) => (
          <span
            key={i}
            className={
              rowClassName ?? 'h-7 shrink-0 flex items-center justify-center'
            }
          >
            {d}
          </span>
        ))}
      </span>
    </span>
  );
}

export function CountdownBlock({
  value,
  className,
  rowClassName,
  rowHeightRem,
}: {
  value: number;
  className?: string;
  rowClassName?: string;
  rowHeightRem?: number;
}) {
  const padded = padZero(value);
  return (
    <>
      <SlotDigit
        value={parseInt(padded[0], 10)}
        className={className}
        rowClassName={rowClassName}
        rowHeightRem={rowHeightRem}
      />
      <SlotDigit
        value={parseInt(padded[1], 10)}
        className={className}
        rowClassName={rowClassName}
        rowHeightRem={rowHeightRem}
      />
    </>
  );
}
