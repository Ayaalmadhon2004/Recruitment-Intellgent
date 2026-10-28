import type { ReactNode } from 'react';
import { en } from '@/domain/copy';
import { Button, Card, Icon } from '@/ui';
import styles from './LockedArea.module.css';

export type LockedAreaProps = {
  name: string;
  /** Where "See unlock options" goes. Without it (print) there is no button. */
  unlockHref?: string;
  headingLevel?: 'h3' | 'h4';
};

/** A hidden area: a lock, the word "Locked" and one line. It never receives the area's result. */
export function LockedArea({ name, unlockHref, headingLevel = 'h3' }: LockedAreaProps): ReactNode {
  const Heading = headingLevel;
  return (
    <Card as="article" tone="dashed" radius="lg" aria-label={name} data-locked="">
      <div className={styles.locked}>
        <span className={styles.mark} aria-hidden="true">
          <Icon name="lock" size={28} strokeWidth={2.4} />
        </span>
        <div className={styles.lockedText}>
          <Heading className={styles.name}>{name}</Heading>
          <span className={styles.word}>{en.report.locked.word}</span>
          <p className={styles.body}>{en.report.locked.body}</p>
          {unlockHref ? (
            <Button href={unlockHref} size="sm" variant="secondary">
              {en.unlock.cta.seeOptions}
            </Button>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
