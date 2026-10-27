import type { ReactNode } from 'react';
import { Button } from '@/ui';
import styles from './CtaBand.module.css';

export type CtaAction = {
  label: string;
  href: string;
  variant?: 'inverse' | 'inverse-outline';
};

export type CtaBandProps = {
  title: string;
  body?: string;
  eyebrow?: string;
  /** Small line under the body, for example a note that something is to be confirmed. */
  note?: ReactNode;
  actions: readonly CtaAction[];
};

export function CtaBand({ title, body, eyebrow, note, actions }: CtaBandProps): ReactNode {
  return (
    <section className={styles.band} aria-label={title}>
      <div className={styles.text}>
        {eyebrow ? <span className={styles.eyebrow}>{eyebrow}</span> : null}
        <h2 className={styles.title}>{title}</h2>
        {body ? <p className={styles.body}>{body}</p> : null}
        {note ? <p className={styles.note}>{note}</p> : null}
      </div>
      <div className={styles.actions}>
        {actions.map((a) => (
          <Button key={a.href + a.label} href={a.href} variant={a.variant ?? 'inverse'} size="lg">
            {a.label}
          </Button>
        ))}
      </div>
    </section>
  );
}
