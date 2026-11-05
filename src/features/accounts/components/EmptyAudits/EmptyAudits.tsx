import type { ReactNode } from 'react';
import { routes } from '@/domain/config';
import { en, fill } from '@/domain/copy';
import { EmptyState } from '@/patterns';
import { Button } from '@/ui';
import styles from './EmptyAudits.module.css';

export type EmptyAuditsProps = {
  total: number;
  onStart: () => void;
};

const copy = en.accounts.dashboard.empty;

/** "No audits yet". Offers the full audit, or the Quick Start. */
export function EmptyAudits({ total, onStart }: EmptyAuditsProps): ReactNode {
  return (
    <EmptyState
      label={copy.label}
      eyebrow={copy.eyebrow}
      title={copy.title}
      body={copy.body}
      visual={
        <svg
          viewBox="0 0 160 160"
          width="180"
          height="180"
          role="img"
          aria-label={copy.ringAria}
          className={styles.ring}
        >
          <circle cx="80" cy="80" r="62" className={styles.dashed} />
          <circle cx="80" cy="80" r="44" className={styles.inner} />
          <text x="80" y="88" textAnchor="middle" className={styles.count}>
            {fill(copy.ringText, { total })}
          </text>
        </svg>
      }
    >
      <Button onClick={onStart}>{copy.start}</Button>
      <Button href={routes.quickStart} variant="outline">
        {copy.quickStart}
      </Button>
    </EmptyState>
  );
}
