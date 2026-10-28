import type { ReactNode } from 'react';
import { en } from '@/domain/copy';
import { SectionHeader } from '@/shell';
import { Card, Icon } from '@/ui';
import type { IconName } from '@/ui';
import styles from './AdvisorRequest.module.css';

const reasons = [
  {
    id: 'mixed',
    icon: 'chart',
    tone: 'default',
    radius: 'lg',
    copy: en.advisor.when.reasons.mixed,
  },
  { id: 'agents', icon: 'users', tone: 'navy', radius: 'md', copy: en.advisor.when.reasons.agents },
  {
    id: 'price',
    icon: 'dollar',
    tone: 'dashed',
    radius: 'sm',
    copy: en.advisor.when.reasons.price,
  },
] as const satisfies readonly {
  id: string;
  icon: IconName;
  tone: 'default' | 'navy' | 'dashed';
  radius: 'sm' | 'md' | 'lg';
  copy: { title: string; body: string };
}[];

/** The three reasons to talk to a person. */
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
          <li key={r.id} className={styles.reasonItem}>
            <Card tone={r.tone} radius={r.radius} lift className={styles.reason}>
              <span className={styles.reasonIcon}>
                <Icon name={r.icon} size={28} />
              </span>
              <h3 className={styles.reasonTitle}>{r.copy.title}</h3>
              <p className={styles.reasonBody}>{r.copy.body}</p>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}
