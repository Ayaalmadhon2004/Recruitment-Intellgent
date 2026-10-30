import type { ReactNode } from 'react';
import { uiCopy } from '@/design/ui-copy';
import { SwapText } from '../SwapText';
import styles from './StepLabel.module.css';

export type StepLabelProps = {
  /** Current number, starting at 1. */
  current: number;
  /** Optional total, shown as "Step 2 of 5". */
  total?: number;
  /** The word before the number. Defaults to "Step"; pass "Question" for question flows. */
  word?: string;
  className?: string;
};

/**
 * The one shared "Step N" / "Question N" label. When the number changes the old one fades out with a
 * 6px slide while the new one fades in (static under prefers-reduced-motion), and the label is a
 * polite live region.
 */
export function StepLabel({
  current,
  total,
  word = uiCopy.step.step,
  className,
}: StepLabelProps): ReactNode {
  return (
    <p
      className={[styles.label, className].filter(Boolean).join(' ')}
      role="status"
      aria-live="polite"
    >
      <span>{word}</span> <SwapText>{current}</SwapText>
      {total !== undefined ? (
        <>
          {' '}
          <span>{uiCopy.step.of}</span> <span>{total}</span>
        </>
      ) : null}
    </p>
  );
}
