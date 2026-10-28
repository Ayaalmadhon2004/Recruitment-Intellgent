import type { ReactNode } from 'react';
import { en } from '@/domain/copy';
import { Icon } from '@/ui';
import styles from './DevAccountsNotice.module.css';

const copy = en.accounts.dev;

/** Shown while the development account service is in use, so nobody mistakes it for a real account. */
export function DevAccountsNotice(): ReactNode {
  return (
    <div role="note" className={styles.notice}>
      <Icon name="info" size={20} />
      <p className={styles.text}>
        <strong>{copy.heading}.</strong> {copy.body}
      </p>
    </div>
  );
}
