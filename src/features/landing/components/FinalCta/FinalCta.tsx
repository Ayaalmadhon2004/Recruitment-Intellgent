'use client';

import { useEffect, useRef, useState } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { auditScope } from '@/domain/config';
import { en, fill } from '@/domain/copy';
import { PlainSection } from '@/shell';
import { Button, Kite } from '@/ui';
import styles from './FinalCta.module.css';

const copy = en.landing.finalCta;
/** How long the kite flies before the next page opens. */
const FLIGHT_MS = 400;

export type FinalCtaProps = {
  startHref: string;
};

function prefersReducedMotion(): boolean {
  return (
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

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
    timer.current = window.setTimeout(() => router.push(startHref), FLIGHT_MS);
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
            <Button href={startHref} size="lg" onClick={onStart}>
              {copy.primary}
            </Button>
            <Button href={en.site.url} size="lg" variant="outline">
              {copy.secondary}
            </Button>
          </div>
        </div>
      </div>
    </PlainSection>
  );
}
