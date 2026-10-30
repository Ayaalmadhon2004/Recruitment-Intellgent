'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import { duration } from '@/design/motion';
import { uiCopy } from '@/design/ui-copy';
import { Icon } from '../Icon';
import type { IconName } from '../Icon';
import { useReducedMotion } from '../motion';
import styles from './Toast.module.css';

export type ToastStatus = 'success' | 'error' | 'info';

export type ToastOptions = {
  message: string;
  /** Adds an icon and a word so status is never colour alone. Defaults to info. */
  status?: ToastStatus;
  /** Milliseconds before it closes itself. Defaults to 4000. */
  durationMs?: number;
};

type ToastItem = Required<Omit<ToastOptions, 'durationMs'>> & { id: number; durationMs: number };

export type ToastApi = { show: (options: ToastOptions) => void };

const ToastContext = createContext<ToastApi | null>(null);

const icons: Record<ToastStatus, IconName> = {
  success: 'check-circle',
  error: 'concern',
  info: 'info',
};

const DEFAULT_DURATION = 4000;
/** At most this many toasts are visible; a newer one pushes the oldest out. */
const MAX_VISIBLE = 2;

/** Call `useToast().show({ message, status })` from any client component under <ToastProvider>. */
export function useToast(): ToastApi {
  const api = useContext(ToastContext);
  if (!api) throw new Error('useToast must be used inside <ToastProvider>');
  return api;
}

function ToastPill({ item, onDone }: { item: ToastItem; onDone: (id: number) => void }): ReactNode {
  const [leaving, setLeaving] = useState(false);
  const reduced = useReducedMotion();

  // Closing slides the pill up and out first, then removes it. Reduced motion removes it at once.
  const close = useCallback((): void => {
    if (reduced) onDone(item.id);
    else setLeaving(true);
  }, [reduced, onDone, item.id]);

  useEffect(() => {
    const timer = window.setTimeout(close, item.durationMs);
    return () => window.clearTimeout(timer);
  }, [item.durationMs, close]);

  useEffect(() => {
    if (!leaving) return;
    const timer = window.setTimeout(() => onDone(item.id), duration.base);
    return () => window.clearTimeout(timer);
  }, [leaving, onDone, item.id]);

  return (
    <div className={styles.toast} data-status={item.status} data-leaving={leaving || undefined}>
      <Icon name={icons[item.status]} size={20} />
      <span className={styles.text}>
        <strong className={styles.word}>{uiCopy.toast.status[item.status]}</strong>
        <span className={styles.message}>{item.message}</span>
      </span>
      <button
        type="button"
        className={styles.dismiss}
        aria-label={uiCopy.toast.dismiss}
        onClick={close}
      >
        <Icon name="close" size={16} />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }): ReactNode {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const remove = useCallback((id: number): void => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const api = useMemo<ToastApi>(
    () => ({
      show: ({ message, status = 'info', durationMs = DEFAULT_DURATION }) => {
        const id = nextId.current++;
        // The same message is never stacked: while one is showing, asking again does nothing.
        setItems((current) =>
          current.some((item) => item.message === message && item.status === status)
            ? current
            : [...current.slice(1 - MAX_VISIBLE), { id, message, status, durationMs }],
        );
      },
    }),
    [],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        className={styles.region}
        role="status"
        aria-live="polite"
        aria-label={uiCopy.toast.regionLabel}
        data-print="hide"
      >
        {items.map((item) => (
          <ToastPill key={item.id} item={item} onDone={remove} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
