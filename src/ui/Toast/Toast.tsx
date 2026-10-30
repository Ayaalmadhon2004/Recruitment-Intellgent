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
import { uiCopy } from '@/design/ui-copy';
import { Icon } from '../Icon';
import type { IconName } from '../Icon';
import styles from './Toast.module.css';

export type ToastStatus = 'success' | 'error' | 'info';

export type ToastOptions = {
  message: string;
  /** Adds an icon and a word so status is never colour alone. Defaults to info. */
  status?: ToastStatus;
  /** Milliseconds before it closes itself. Defaults to 6000. */
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

const DEFAULT_DURATION = 6000;

/** Call `useToast().show({ message, status })` from any client component under <ToastProvider>. */
export function useToast(): ToastApi {
  const api = useContext(ToastContext);
  if (!api) throw new Error('useToast must be used inside <ToastProvider>');
  return api;
}

function ToastPill({ item, onDone }: { item: ToastItem; onDone: (id: number) => void }): ReactNode {
  useEffect(() => {
    const timer = window.setTimeout(() => onDone(item.id), item.durationMs);
    return () => window.clearTimeout(timer);
  }, [item.id, item.durationMs, onDone]);

  return (
    <div className={styles.toast} data-status={item.status}>
      <Icon name={icons[item.status]} size={20} />
      <span className={styles.text}>
        <strong className={styles.word}>{uiCopy.toast.status[item.status]}</strong>
        <span className={styles.message}>{item.message}</span>
      </span>
      <button
        type="button"
        className={styles.dismiss}
        aria-label={uiCopy.toast.dismiss}
        onClick={() => onDone(item.id)}
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
        setItems((current) => [...current.slice(-2), { id, message, status, durationMs }]);
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
