import type { ReactNode } from 'react';
import { cx } from '../internal/cx';
import { Icon } from '../Icon';
import styles from './Field.module.css';

export type FieldShellProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  /** Extra class on the hint, for a caller that shows it as a pill. */
  hintClassName?: string;
  children: ReactNode;
};

export const hintId = (id: string): string => `${id}-hint`;
export const errorId = (id: string): string => `${id}-error`;

/** Real label, optional hint, optional error with icon. Shared by Field and Select. */
export function FieldShell({
  id,
  label,
  hint,
  error,
  hintClassName,
  children,
}: FieldShellProps): ReactNode {
  return (
    <div className={styles.shell}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      {children}
      {hint ? (
        <span id={hintId(id)} className={cx(styles.hint, hintClassName)}>
          {hint}
        </span>
      ) : null}
      {error ? (
        <span id={errorId(id)} role="alert" className={styles.error}>
          <Icon name="concern" size={16} strokeWidth={2.4} />
          {error}
        </span>
      ) : null}
    </div>
  );
}

export function describedBy(id: string, hint?: string, error?: string): string | undefined {
  const ids = [hint ? hintId(id) : null, error ? errorId(id) : null].filter(Boolean);
  return ids.length ? ids.join(' ') : undefined;
}
