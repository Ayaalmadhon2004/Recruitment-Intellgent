import type { ReactNode } from 'react';
import { en } from '@/domain/copy';
import { BubblePopover } from '@/ui';
import styles from './AdvisorRequest.module.css';

const reasons = [
  en.advisor.when.reasons.mixed,
  en.advisor.when.reasons.agents,
  en.advisor.when.reasons.price,
] as const;

/** "When to talk to a person": a heading with a small "!" that opens the three reasons in a bubble. */
export function WhenToTalk(): ReactNode {
  return (
    <section aria-labelledby="advisor-when" className={styles.when}>
      <h2 id="advisor-when" className={styles.whenTitle}>
        {en.advisor.when.title}
        <BubblePopover>
          <ul className={styles.reasons}>
            {reasons.map((r) => (
              <li key={r.title} className={styles.reason}>
                <strong className={styles.reasonTitle}>{r.title}</strong>
                <span className={styles.reasonBody}>{r.body}</span>
              </li>
            ))}
          </ul>
        </BubblePopover>
      </h2>
    </section>
  );
}
