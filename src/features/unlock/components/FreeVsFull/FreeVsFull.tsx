import type { ReactNode } from 'react';
import { en } from '@/domain/copy';
import { SectionHeader } from '@/shell';
import { Card, Icon } from '@/ui';
import styles from './FreeVsFull.module.css';

const copy = en.unlock.split;
const { free: freePlan, full: fullPlan } = en.landing.compare;

// One list for Home and Unlock: both read the landing copy, so the Free line cannot drift.
const freeItems = freePlan.items.filter((item) => item.included);
const fullItems = fullPlan.items;

export type FreeVsFullProps = {
  /** True once the audit is unlocked: the full list then reads Unlocked, with ticks. */
  unlocked: boolean;
};

/** What is free and what the full report holds. Uses the same lists as the Free or Full section on Home. */
export function FreeVsFull({ unlocked }: FreeVsFullProps): ReactNode {
  return (
    <section aria-labelledby="unlock-split-title" className={styles.section}>
      <SectionHeader id="unlock-split-title" eyebrow={copy.eyebrow} title={copy.title} />
      <div className={styles.grid}>
        <Card as="article" aria-label={copy.freeTitle} tone="open" radius="lg" lift className={styles.card}>
          <div className={styles.head}>
            <h3 className={styles.name}>{copy.freeTitle}</h3>
            <span className={styles.tagFree}>
              <Icon name="check" size={14} strokeWidth={2.6} />
              {copy.freeTag}
            </span>
          </div>
          <ul className={styles.list}>
            {freeItems.map((item) => (
              <li key={item.label} className={styles.row}>
                <span className={styles.markFree} aria-hidden="true">
                  <Icon name="check" size={18} strokeWidth={2.4} />
                </span>
                <span className={styles.label}>{item.label}</span>
                <span className={styles.wordFree}>{copy.freeWord}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card
          as="article"
          aria-label={copy.fullTitle}
          tone="navy"
          radius="lg"
          lift
          className={styles.card}
        >
          <div className={styles.head}>
            <h3 className={`${styles.name} ${styles.nameOnNavy}`}>{copy.fullTitle}</h3>
            <span className={styles.tagFull}>
              <Icon name={unlocked ? 'check' : 'minus'} size={14} strokeWidth={2.6} />
              {unlocked ? copy.unlockedWord : copy.lockedWord}
            </span>
          </div>
          <ul className={styles.list}>
            {fullItems.map((item) => (
              <li key={item.label} className={styles.row}>
                <span className={styles.markFull} aria-hidden="true">
                  <Icon name={unlocked ? 'check' : 'minus'} size={18} strokeWidth={2.2} />
                </span>
                <span className={styles.label}>{item.label}</span>
                <span className={styles.wordFull}>
                  {unlocked ? copy.unlockedWord : copy.lockedWord}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </section>
  );
}
