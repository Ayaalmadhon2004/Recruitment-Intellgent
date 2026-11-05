'use client';

import type { ReactNode } from 'react';
import { auditScope } from '@/domain/config';
import { en, fill } from '@/domain/copy';
import { PlainSection } from '@/shell';
import { Breathe, Button, Kite } from '@/ui';
import styles from './FinalCta.module.css';

const copy = en.landing.finalCta;

export type FinalCtaProps = {
  startHref: string;
};

/**
 * The closing call to action: text on the page background and a pill button. The button is a real
 * link; with JavaScript the paper plane carries the press to the audit (see Button).
 */
export function FinalCta({ startHref }: FinalCtaProps): ReactNode {
  return (
    <PlainSection title={copy.title} separator="line">
      <div className={styles.row}>
        <div className={styles.kite}>
          <Kite wings="open" size="lg" />
        </div>
        <div className={styles.text}>
          <p className={styles.body}>
            {fill(copy.body, { quickStart: auditScope.quickStartQuestions })}
          </p>
          <div className={styles.actions}>
            <Breathe>
              <Button href={startHref} size="lg">
                {copy.primary}
              </Button>
            </Breathe>
            <Button href={en.site.url} size="lg" variant="outline">
              {copy.secondary}
            </Button>
          </div>
        </div>
      </div>
    </PlainSection>
  );
}
