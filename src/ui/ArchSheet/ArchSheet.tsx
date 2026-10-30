'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { duration } from '@/design/motion';
import { uiCopy } from '@/design/ui-copy';
import { Icon } from '../Icon';
import { useReducedMotion } from '../motion';
import styles from './ArchSheet.module.css';

export type ArchSheetProps = {
  open: boolean;
  onClose: () => void;
  /** Visible heading; also the dialog's accessible name. */
  title: string;
  children: ReactNode;
  /** Accessible name of the close mark. Defaults to the shared copy. */
  closeLabel?: string;
};

/** How far the handle has to be dragged down, in px, before the bottom sheet closes. */
const DISMISS_DRAG_PX = 96;

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Arch-topped modal (a bottom sheet with a drag handle on mobile) over a navy-tinted blurred backdrop.
 * Traps focus, closes on Esc, the close mark, a backdrop press or a drag down on the handle, locks page scroll while open, and returns focus on close.
 */
export function ArchSheet({
  open,
  onClose,
  title,
  children,
  closeLabel = uiCopy.sheet.close,
}: ArchSheetProps): ReactNode {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const onCloseRef = useRef(onClose);
  const dragStartY = useRef<number | null>(null);
  const reduced = useReducedMotion();
  // After `open` turns false the sheet stays mounted for the (faster) closing animation, then unmounts.
  const [visible, setVisible] = useState(open);
  if (open && !visible) setVisible(true);

  useEffect(() => {
    if (open || !visible) return;
    // With reduced motion there is no closing animation to wait for.
    const timer = window.setTimeout(() => setVisible(false), reduced ? 0 : duration.base);
    return () => window.clearTimeout(timer);
  }, [open, visible, reduced]);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const { overflow, paddingRight } = document.body.style;
    document.body.style.overflow = 'hidden';
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    panelRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab') return;
      const panel = panelRef.current;
      if (!panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) {
        event.preventDefault();
        return;
      }
      const first = items[0]!;
      const last = items[items.length - 1]!;
      const active = document.activeElement;
      if (event.shiftKey && (active === first || active === panel)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      } else if (!panel.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      previous?.focus();
    };
  }, [open]);

  const dragBy = (event: ReactPointerEvent<HTMLDivElement>): number =>
    dragStartY.current === null ? 0 : Math.max(0, event.clientY - dragStartY.current);

  const onHandleDown = (event: ReactPointerEvent<HTMLDivElement>): void => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStartY.current = event.clientY;
    if (panelRef.current) panelRef.current.style.transition = 'none';
  };
  const onHandleMove = (event: ReactPointerEvent<HTMLDivElement>): void => {
    if (dragStartY.current === null || !panelRef.current) return;
    panelRef.current.style.transform = `translateY(${dragBy(event)}px)`;
  };
  const onHandleUp = (event: ReactPointerEvent<HTMLDivElement>): void => {
    const distance = dragBy(event);
    dragStartY.current = null;
    const panel = panelRef.current;
    if (panel) {
      panel.style.transition = '';
      panel.style.transform = '';
    }
    if (distance > DISMISS_DRAG_PX) onClose();
  };

  if (!visible || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className={styles.backdrop}
      data-closing={!open || undefined}
      onPointerDown={(event) => event.target === event.currentTarget && onClose()}
      data-print="hide"
    >
      <div
        ref={panelRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <div
          aria-hidden="true"
          className={styles.handle}
          onPointerDown={onHandleDown}
          onPointerMove={onHandleMove}
          onPointerUp={onHandleUp}
          onPointerCancel={onHandleUp}
        />
        <button type="button" className={styles.close} aria-label={closeLabel} onClick={onClose}>
          <Icon name="close" size={22} />
        </button>
        <h2 id={titleId} className={styles.title}>
          {title}
        </h2>
        <div className={styles.body}>{children}</div>
      </div>
    </div>,
    document.body,
  );
}
