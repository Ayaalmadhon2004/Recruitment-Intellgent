import type { ReactNode } from 'react';
import { uiCopy } from '@/design/ui-copy';
import { auditScope } from '@/domain/config';
import { en, fill } from '@/domain/copy';
import type { KiteProgress } from '@/ui';
import { Kite, Reveal } from '@/ui';
import styles from './HowItWorks.module.css';

const copy = en.landing.how;
const home = uiCopy.home;
const counts = {
  quickStart: auditScope.quickStartQuestions,
  total: auditScope.totalQuestions,
};
const PROGRESS: readonly KiteProgress[] = [1, 2, 3];

/** The three steps, drawn as one kite that is completed a third at a time. No numerals: the order is the list order. */
export function HowItWorks(): ReactNode {
  return (
    <ol className={styles.list} aria-label={copy.listLabel}>
      {copy.steps.map((s, i) => {
        const progress = PROGRESS[i];
        const label = home.kiteSteps[i];
        return (
          <li key={s.title} className={styles.step}>
            <Reveal index={i} className={styles.reveal}>
              {progress ? <Kite progress={progress} size="lg" title={label} /> : null}
              <h3 className={styles.title}>{fill(s.title, counts)}</h3>
              <p className={styles.body}>{s.body}</p>
              <span className={styles.time}>{fill(s.time, counts)}</span>
            </Reveal>
          </li>
        );
      })}
    </ol>
  );
}
