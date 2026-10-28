import { useId } from 'react';
import type { ReactNode } from 'react';
import { cx } from '@/ui';
import styles from './FilterGroup.module.css';

export type FilterOption<T extends string> = { value: T; label: string; count: number };

export type FilterGroupProps<T extends string> = {
  label: string;
  options: readonly FilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

/** A group of toggle buttons where one is pressed. The count is text beside the label. */
export function FilterGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: FilterGroupProps<T>): ReactNode {
  const labelId = useId();
  return (
    <div className={styles.field}>
      <span id={labelId} className={styles.label}>
        {label}
      </span>
      <div role="group" aria-labelledby={labelId} className={styles.group}>
        {options.map((option) => {
          const on = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={on}
              className={cx(styles.button, on && styles.on)}
              onClick={() => onChange(option.value)}
            >
              {option.label}
              <span className={styles.count}>{option.count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
