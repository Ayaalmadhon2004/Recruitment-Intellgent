import type { ReactNode } from 'react';
import styles from './EmptyState.module.css';

export type EmptyStateProps = {
  /** Accessible name of the region, for example "No saved audits". */
  label: string;
  /** Small caps line above the title. */
  eyebrow?: string;
  title: string;
  body: string;
  /** A picture on the left (a ring, the kite). Decorative unless it carries its own accessible name. */
  visual: ReactNode;
  /** The way forward: one or two buttons. */
  children: ReactNode;
  /** The page's h1 when the empty state is the whole page, an h2 when the page has its own heading. */
  headingLevel?: 1 | 2;
};

/** "Nothing here yet" with a way forward. One shape for every page that can be empty, centred, with no rules of its own. */
export function EmptyState({
  label,
  eyebrow,
  title,
  body,
  visual,
  children,
  headingLevel = 2,
}: EmptyStateProps): ReactNode {
  const Heading = headingLevel === 1 ? 'h1' : 'h2';
  return (
    <section aria-label={label} className={styles.empty}>
      <div className={styles.visual}>{visual}</div>
      <div className={styles.text}>
        {eyebrow ? <span className={styles.eyebrow}>{eyebrow}</span> : null}
        <Heading className={styles.title}>{title}</Heading>
        <p className={styles.body}>{body}</p>
        <div className={styles.actions}>{children}</div>
      </div>
    </section>
  );
}
