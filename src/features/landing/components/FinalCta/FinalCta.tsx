'use client';

import { useEffect, useRef, useState } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { flight } from '@/design/motion';
import { auditScope } from '@/domain/config';
import { en, fill } from '@/domain/copy';
import { PlainSection } from '@/shell';
import { Breathe, Button, Kite, prefersReducedMotion } from '@/ui';
import styles from './FinalCta.module.css';

const copy = en.landing.finalCta;

export type FinalCtaProps = {
  startHref: string;
};

/**
 * The closing call to action: text on the page background and a pill button. The button is a real
 * link; with JavaScript the kite lifts off for a moment before the audit opens.
 */
export function FinalCta({ startHref }: FinalCtaProps): ReactNode {
  const router = useRouter();
  const [flying, setFlying] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onStart = (event: MouseEvent<HTMLAnchorElement>): void => {
    const plainClick =
      event.button === 0 && !(event.metaKey || event.ctrlKey || event.shiftKey || event.altKey);
    if (!plainClick || event.defaultPrevented || prefersReducedMotion() || flying) return;
    event.preventDefault();
    setFlying(true);
    timer.current = window.setTimeout(() => router.push(startHref), flight);
  };

  return (
    <PlainSection title={copy.title} separator="line">
      <div className={styles.row}>
        <div className={styles.kite} data-flying={flying}>
          <Kite wings="open" size="lg" />
        </div>
        <div className={styles.text}>
          <p className={styles.body}>
            {fill(copy.body, { quickStart: auditScope.quickStartQuestions })}
          </p>
          <div className={styles.actions}>
            <Breathe>
              <Button href={startHref} size="lg" onClick={onStart}>
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
