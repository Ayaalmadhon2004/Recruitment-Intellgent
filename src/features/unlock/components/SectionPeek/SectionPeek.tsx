import type { ReactNode } from 'react';
import { routes } from '@/domain/config';
import { en } from '@/domain/copy';
import { SectionHeader } from '@/shell';
import { Button, Icon, cx } from '@/ui';
import styles from './SectionPeek.module.css';

const copy = en.unlock.peek;

/** Placeholder bars that stand in for a section's content. Widths only; they carry no data. */
const rows = [
  { title: 70, line: 45, chip: 18 },
  { title: 58, line: 36, chip: 22 },
  { title: 76, line: 50, chip: 16 },
  { title: 64, line: 40, chip: 20 },
] as const;

export type SectionPeekProps = {
  unlocked: boolean;
  /** What the lock card offers: a button to open the options, a hint, or a way to start. */
  action?: ReactNode;
  /** Extra line in the lock card, for example why there is nothing to unlock yet. */
  note?: string;
  reportHref?: string;
};

/** A blurred stand-in for a full-report section, with a lock card on top while the audit is not unlocked. */
export function SectionPeek({
  unlocked,
  action,
  note,
  reportHref = routes.report,
}: SectionPeekProps): ReactNode {
  return (
    <section aria-labelledby="unlock-peek-title" className={styles.section}>
      <SectionHeader id="unlock-peek-title" eyebrow={copy.eyebrow} title={copy.title} />
      <div className={styles.frame}>
        <div
          aria-hidden="true"
          className={cx(styles.bars, unlocked ? styles.clear : styles.blurred)}
        >
          <div className={styles.heading} />
          {rows.map((r, i) => (
            <div key={r.title} className={styles.row}>
              <div className={styles.avatar} />
              <div className={styles.lines}>
                <div className={styles.title} style={{ width: `${r.title}%` }} />
                <div className={styles.line} style={{ width: `${r.line}%` }} />
              </div>
              <div
                className={cx(styles.chip, i % 2 === 0 ? styles.chipNavy : styles.chipCrimson)}
                style={{ flexBasis: `calc(${r.chip} * 3 * var(--space-1) / 4 + var(--space-6))` }}
              />
            </div>
          ))}
        </div>
        {unlocked ? (
          <div className={styles.unlockedBar}>
            <Icon name="check-circle" size={20} strokeWidth={2.4} />
            <span>{copy.unlockedNote}</span>
            <Button href={reportHref} size="sm" variant="secondary">
              {copy.openReport}
            </Button>
          </div>
        ) : (
          <div className={styles.overlay}>
            <div className={cx(styles.lockCard, 'anim-pop')}>
              <span className={styles.lock} aria-hidden="true">
                <Icon name="lock" size={24} strokeWidth={2.2} />
              </span>
              <h3 className={styles.lockTitle}>{copy.lockedName}</h3>
              <p className={styles.lockBody}>{copy.lockedBody}</p>
              {note ? <p className={styles.lockBody}>{note}</p> : null}
              {action}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
