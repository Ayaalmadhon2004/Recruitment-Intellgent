import type { ReactNode } from 'react';
import styles from './SectionHeader.module.css';

export type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  /** Heading level. Defaults to h2. */
  level?: 'h1' | 'h2' | 'h3';
  id?: string;
};

export function SectionHeader({ eyebrow, title, level = 'h2', id }: SectionHeaderProps): ReactNode {
  const Heading = level;
  return (
    <div className={styles.header}>
      <span className={styles.eyebrow}>{eyebrow}</span>
      <Heading id={id} className={`${styles.title} ${styles[level]}`}>
        {title}
      </Heading>
    </div>
  );
}
