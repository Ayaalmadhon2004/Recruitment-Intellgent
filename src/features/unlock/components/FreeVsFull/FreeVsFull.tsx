import type { ReactNode } from 'react';
import { tbcConfig, unlockConfig } from '@/domain/config';
import { en, t } from '@/domain/copy';
import { TbcValue } from '@/patterns';
import { SectionHeader } from '@/shell';
import { Card, Icon } from '@/ui';
import styles from './FreeVsFull.module.css';

const copy = en.unlock.split;

export type FreeVsFullProps = {
  /** True once the audit is unlocked: the full list then reads Unlocked, with ticks. */
  unlocked: boolean;
};

/**
 * What is free and what the full report holds. The lists are the design's example (`unlock.config.ts`); the
 * confirmed free vs locked line is not known, so it is shown beside them as to be confirmed.
 */
export function FreeVsFull({ unlocked }: FreeVsFullProps): ReactNode {
  const { free, full } = unlockConfig.exampleSplit;
  return (
    <section aria-labelledby="unlock-split-title" className={styles.section}>
      <SectionHeader id="unlock-split-title" eyebrow={copy.eyebrow} title={copy.title} />
      <p className={styles.note}>
        {copy.exampleNote}{' '}
        <TbcValue value={tbcConfig.freeVsLockedLine} placeholder={en.status.tbc} />
      </p>
      <div className={styles.grid}>
        <Card as="article" radius="lg" lift className={styles.card}>
          <div className={styles.head}>
            <h3 className={styles.name}>{copy.freeTitle}</h3>
            <span className={styles.tagFree}>
              <Icon name="check" size={14} strokeWidth={2.6} />
              {copy.freeTag}
            </span>
          </div>
          <ul className={styles.list}>
            {free.map((item) => (
              <li key={item.id} className={styles.row}>
                <span className={styles.markFree} aria-hidden="true">
                  <Icon name="check" size={18} strokeWidth={2.4} />
                </span>
                <span className={styles.label}>{t(item.labelKey)}</span>
                <span className={styles.wordFree}>{copy.freeWord}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card as="article" tone="navy" radius="lg" lift className={styles.card}>
          <div className={styles.head}>
            <h3 className={styles.name}>{copy.fullTitle}</h3>
            <span className={styles.tagFull}>
              <Icon name={unlocked ? 'check' : 'lock'} size={14} strokeWidth={2.6} />
              {unlocked ? copy.unlockedWord : copy.lockedWord}
            </span>
          </div>
          <ul className={styles.list}>
            {full.map((item) => (
              <li key={item.id} className={styles.row}>
                <span className={styles.markFull} aria-hidden="true">
                  <Icon name={unlocked ? 'check' : 'lock'} size={18} strokeWidth={2.2} />
                </span>
                <span className={styles.label}>{t(item.labelKey)}</span>
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
