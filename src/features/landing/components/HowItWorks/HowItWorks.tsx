import type { ReactNode } from 'react';
import { auditScope } from '@/domain/config';
import { en, fill } from '@/domain/copy';
import { SectionHeader } from '@/shell';
import { Card, Reveal } from '@/ui';
import styles from './HowItWorks.module.css';

const copy = en.landing.how;
const counts = {
  quickStart: auditScope.quickStartQuestions,
  total: auditScope.totalQuestions,
};
const DELAYS = [0, 1, 2] as const;

export function HowItWorks(): ReactNode {
  return (
    <section id="how" className={styles.section} aria-labelledby="landing-how-title">
      <SectionHeader eyebrow={copy.eyebrow} title={copy.title} id="landing-how-title" />
      <div className={styles.timeline}>
        <span className={styles.lineH} aria-hidden="true" />
        <span className={styles.lineV} aria-hidden="true" />
        <ol className={styles.list} aria-label={copy.listLabel}>
          {copy.steps.map((s, i) => (
            <li key={s.title} className={styles.step}>
              <Reveal delay={DELAYS[i]} className={styles.reveal}>
                <span className={styles.number}>{i + 1}</span>
                <Card
                  as="div"
                  radius="sm"
                  lift
                  accent={i % 2 === 0 ? 'navy' : 'crimson'}
                  className={styles.card}
                >
                  <h3 className={styles.title}>{fill(s.title, counts)}</h3>
                  <p className={styles.body}>{s.body}</p>
                  <span className={styles.time}>{fill(s.time, counts)}</span>
                </Card>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
