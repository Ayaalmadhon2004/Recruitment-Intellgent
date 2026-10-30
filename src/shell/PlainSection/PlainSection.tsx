import { useId } from 'react';
import type { ReactNode } from 'react';
import { cx } from '@/ui';
import { PageContainer } from '../PageContainer';
import styles from './PlainSection.module.css';

export type PlainSectionProps = {
  title: string;
  /** Short line above the title. */
  eyebrow?: string;
  children?: ReactNode;
  /** Heading level. Defaults to h2. */
  level?: 'h1' | 'h2' | 'h3';
  /** How it is set apart from the next block: whitespace only, or a thin line on top. */
  separator?: 'space' | 'line';
  className?: string;
};

/** A heading and content set straight on the page background: no card, no box. */
export function PlainSection({
  title,
  eyebrow,
  children,
  level = 'h2',
  separator = 'space',
  className,
}: PlainSectionProps): ReactNode {
  const headingId = useId();
  const Heading = level;
  return (
    <section
      aria-labelledby={headingId}
      className={cx(styles.section, separator === 'line' && styles.line, className)}
    >
      <PageContainer>
        <header className={styles.header}>
          {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
          <Heading id={headingId} className={styles.title}>
            {title}
          </Heading>
        </header>
        {children ? <div className={styles.body}>{children}</div> : null}
      </PageContainer>
    </section>
  );
}
