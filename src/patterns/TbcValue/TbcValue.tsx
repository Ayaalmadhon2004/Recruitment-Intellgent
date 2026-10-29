import type { ReactNode } from 'react';
import { Icon } from '@/ui';
import styles from './TbcValue.module.css';

export type TbcValueProps = {
  /** Null (or undefined, or blank) means not yet confirmed. */
  value: string | number | null | undefined;
  /** The full placeholder text, for example "[TO BE CONFIRMED WITH CAPSTONE]". Comes from copy. Shown as a tooltip and read by screen readers. */
  placeholder: string;
  /** The short visible word, for example "Pending". Comes from copy. Falls back to the placeholder. */
  label?: string;
};

/** Renders the value, or a quiet "Pending" chip when it is not confirmed. Never renders a guess. */
export function TbcValue({ value, placeholder, label }: TbcValueProps): ReactNode {
  if (value === null || value === undefined || value === '') {
    const short = label ?? placeholder;
    return (
      <span className={styles.tbc} data-tbc="true" title={placeholder}>
        <Icon name="clock" size={14} />
        <span aria-hidden={label ? true : undefined}>{short}</span>
        {label ? <span className="visually-hidden">{placeholder}</span> : null}
      </span>
    );
  }
  return <>{value}</>;
}
