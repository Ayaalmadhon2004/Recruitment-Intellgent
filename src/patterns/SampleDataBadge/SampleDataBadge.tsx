import type { ReactNode } from 'react';
import { cx } from '@/ui';
import styles from './SampleDataBadge.module.css';

export type SampleDataBadgeProps = {
  /** For example "Sample data - illustrative only". Comes from copy. */
  label: string;
  variant?: 'solid' | 'outline';
};

/** Shown on anything that comes from fixtures. */
export function SampleDataBadge({ label, variant = 'solid' }: SampleDataBadgeProps): ReactNode {
  return <span className={cx(styles.badge, styles[variant])}>{label}</span>;
}
