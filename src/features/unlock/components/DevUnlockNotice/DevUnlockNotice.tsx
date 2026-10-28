import type { ReactNode } from 'react';
import { en } from '@/domain/copy';
import { Icon } from '@/ui';
import styles from './DevUnlockNotice.module.css';

const copy = en.unlock.dev;

/** Shown while the development entitlement service is in use, so nobody mistakes it for a real purchase. */
export function DevUnlockNotice(): ReactNode {
  return (
    <div role="note" className={styles.notice}>
      <Icon name="info" size={20} />
      <p className={styles.text}>
        <strong>{copy.heading}.</strong> {copy.body}
      </p>
    </div>
  );
}
