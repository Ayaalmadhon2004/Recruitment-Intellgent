import type { ReactNode } from 'react';
import { uiCopy } from '@/design/ui-copy';
import { auditScope } from '@/domain/config';
import { en, fill } from '@/domain/copy';
import type { KiteWings } from '@/ui';
import { Kite, Reveal } from '@/ui';
import styles from './HowItWorks.module.css';

const copy = en.landing.how;
const home = uiCopy.home;
const counts = {
  quickStart: auditScope.quickStartQuestions,
  total: auditScope.totalQuestions,
};
const DELAYS = [0, 1, 2] as const;

/** Each step is one stage of the kite unfolding: folded, left wing open, right wing open. */
const KITE_STEPS: ReadonlyArray<{ wings: KiteWings; label: string }> = [
  { wings: 'closed', label: home.kiteFolded },
  { wings: 'left', label: home.kiteLeft },
  { wings: 'right', label: home.kiteRight },
];

/** The three steps, drawn as the kite unfolding. No numerals: the order is the list order. */
export function HowItWorks(): ReactNode {
  return (
    <ol className={styles.list} aria-label={copy.listLabel}>
      {copy.steps.map((s, i) => {
        const kite = KITE_STEPS[i];
        return (
          <li key={s.title} className={styles.step}>
            <Reveal delay={DELAYS[i]} className={styles.reveal}>
              {kite ? <Kite wings={kite.wings} size="lg" title={kite.label} /> : null}
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
