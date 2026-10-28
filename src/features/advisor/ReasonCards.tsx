import type { ReactNode } from 'react';
import { en } from '@/domain/copy';
import { SectionHeader } from '@/shell';
import { Icon } from '@/ui';
import type { IconName } from '@/ui';
import styles from './AdvisorRequest.module.css';

const reasons = [
  { id: 'mixed', icon: 'chart', copy: en.advisor.when.reasons.mixed },
  { id: 'agents', icon: 'users', copy: en.advisor.when.reasons.agents },
  { id: 'price', icon: 'dollar', copy: en.advisor.when.reasons.price },
] as const satisfies readonly {
  id: string;
  icon: IconName;
  copy: { title: string; body: string };
}[];

/** The three reasons to talk to a person: one strip, one style, divided columns. */
export function ReasonCards(): ReactNode {
  return (
    <section aria-labelledby="advisor-when" className={styles.block}>
      <SectionHeader
        id="advisor-when"
        eyebrow={en.advisor.when.eyebrow}
        title={en.advisor.when.title}
      />
      <ul className={styles.reasons}>
        {reasons.map((r) => (
          <li key={r.id} className={styles.reason}>
            <span className={styles.reasonIcon}>
              <Icon name={r.icon} size={24} />
            </span>
            <h3 className={styles.reasonTitle}>{r.copy.title}</h3>
            <p className={styles.reasonBody}>{r.copy.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
