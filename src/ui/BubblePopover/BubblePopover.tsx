'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { uiCopy } from '@/design/ui-copy';
import { Icon } from '../Icon';
import styles from './BubblePopover.module.css';

export type BubblePopoverProps = {
  /** Content of the bubble. */
  children: ReactNode;
  /** Accessible name of the "!" button. Defaults to the shared copy. */
  label?: string;
};

/** A small "!" button that opens a bubble of help text. Esc or an outside press closes it and returns focus. */
export function BubblePopover({
  children,
  label = uiCopy.bubble.openLabel,
}: BubblePopoverProps): ReactNode {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLSpanElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const bubbleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    const onPointerDown = (event: PointerEvent): void => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open]);

  return (
    <span ref={rootRef} className={styles.root}>
      <button
        ref={buttonRef}
        type="button"
        className={styles.button}
        aria-expanded={open}
        aria-controls={bubbleId}
        aria-label={label}
        onClick={() => setOpen((value) => !value)}
      >
        <span className={styles.mark} aria-hidden="true">
          <Icon name="concern" size={20} />
        </span>
      </button>
      <span id={bubbleId} role="region" aria-label={label} className={styles.bubble} hidden={!open}>
        {children}
      </span>
    </span>
  );
}
