import type { ReactNode } from 'react';
import { routes } from '@/domain/config';
import { en, fill } from '@/domain/copy';
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
    <section aria-label={copy.label} className={styles.empty}>
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
      <div className={styles.text}>
        <span className={styles.eyebrow}>{copy.eyebrow}</span>
        <h2 className={styles.title}>{copy.title}</h2>
        <p className={styles.body}>{copy.body}</p>
        <div className={styles.actions}>
          <Button onClick={onStart}>{copy.start}</Button>
          <Button href={routes.quickStart} variant="secondary">
            {copy.quickStart}
          </Button>
        </div>
      </div>
    </section>
  );
}
