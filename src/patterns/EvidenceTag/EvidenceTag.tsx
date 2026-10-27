import type { ReactNode } from 'react';
import type { EvidenceTag as EvidenceTagId } from '@/domain/types';
import { Icon } from '@/ui';
import type { IconName } from '@/ui';
import styles from './EvidenceTag.module.css';

export type EvidenceTagProps = {
  tag: EvidenceTagId;
  /** Visible word for the tag. Comes from copy. */
  label: string;
};

/** One icon per tag so the five are told apart by shape and word, not colour. */
const icons: Record<EvidenceTagId, IconName> = {
  verified: 'check-circle',
  'institution-reported': 'users',
  estimate: 'chart',
  judgement: 'chat',
  unknown: 'help',
};

export function EvidenceTag({ tag, label }: EvidenceTagProps): ReactNode {
  return (
    <span className={styles.tag} data-evidence={tag}>
      <Icon name={icons[tag]} size={14} strokeWidth={2.4} />
      <span>{label}</span>
    </span>
  );
}
