import type { ReactNode } from 'react';
import { Icon, cx } from '@/ui';
import type { IconName } from '@/ui';
import type { StatusTone } from '../internal/tone';
import styles from './StatusBadge.module.css';

export type StatusBadgeProps = {
  tone: StatusTone;
  /** The word. Required: status is colour plus word plus icon, never colour alone. */
  label: string;
};

const icons: Record<StatusTone, IconName> = {
  strong: 'check-circle',
  caution: 'alert',
  concern: 'concern',
  info: 'info',
};

export function StatusBadge({ tone, label }: StatusBadgeProps): ReactNode {
  return (
    <span className={cx(styles.badge, styles[tone])}>
      <Icon name={icons[tone]} size={20} />
      <span>{label}</span>
    </span>
  );
}
