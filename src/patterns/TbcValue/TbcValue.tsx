import type { ReactNode } from 'react';
import styles from './TbcValue.module.css';

export type TbcValueProps = {
  /** Null (or undefined, or blank) means not yet confirmed. */
  value: string | number | null | undefined;
  /** The placeholder text, for example "[TO BE CONFIRMED WITH CAPSTONE]". Comes from copy. */
  placeholder: string;
};

/** Renders the value, or the labelled placeholder when it is not confirmed. Never renders a guess. */
export function TbcValue({ value, placeholder }: TbcValueProps): ReactNode {
  if (value === null || value === undefined || value === '') {
    return (
      <span className={styles.tbc} data-tbc="true">
        {placeholder}
      </span>
    );
  }
  return <>{value}</>;
}
