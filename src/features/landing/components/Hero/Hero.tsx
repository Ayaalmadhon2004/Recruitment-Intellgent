'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { intro } from '@/design/motion';
import { uiCopy } from '@/design/ui-copy';
import { auditScope } from '@/domain/config';
import { en, fill } from '@/domain/copy';
import { PageContainer } from '@/shell';
import type { KiteWings } from '@/ui';
import { Button, Kite, cx, prefersReducedMotion } from '@/ui';
import styles from './Hero.module.css';

const copy = en.landing.hero;
const home = uiCopy.home;

/** Once per visit: the key lives in sessionStorage, which clears when the tab closes. */
export const INTRO_STORAGE_KEY = 'vri-home-intro-seen';

export type HeroProps = {
  startHref: string;
};

type Phase = 'playing' | 'done';

function introAlreadySeen(): boolean {
  try {
    return window.sessionStorage.getItem(INTRO_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

function markIntroSeen(): void {
  try {
    window.sessionStorage.setItem(INTRO_STORAGE_KEY, '1');
  } catch {
    // Storage can be blocked. The intro then simply plays again next visit.
  }
}

function shouldSkipIntro(): boolean {
  return prefersReducedMotion() || introAlreadySeen();
}

const subscribeNever = (): (() => void) => () => undefined;

/**
 * The home banner. The headline is real text from the first byte; the kite spin, wing opening and
 * "writing" of the words are cosmetic and never block the buttons. Skipped for reduced motion and
 * for anyone who has already seen it this visit.
 */
export function Hero({ startHref }: HeroProps): ReactNode {
  const [played, setPlayed] = useState(false);
  const [openWings, setOpenWings] = useState<KiteWings>('closed');
  const rootRef = useRef<HTMLElement>(null);
  const ready = useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );
  const skipped = useSyncExternalStore(subscribeNever, shouldSkipIntro, () => false);

  const phase: Phase = skipped || played ? 'done' : 'playing';
  const wings: KiteWings = phase === 'done' ? 'open' : openWings;
  // Each line of the block is written in turn: fade plus a short rise, one after another.
  const line = (n: number): { className?: string; style?: CSSProperties } =>
    phase === 'playing'
      ? {
          className: 'anim-up',
          style: { animationDelay: `${intro.linesAt + n * intro.lineGap}ms` },
        }
      : {};

  useEffect(() => {
    if (!ready || phase === 'done') return;
    const timers = [
      window.setTimeout(() => setOpenWings('left'), intro.spinEnd),
      window.setTimeout(() => setOpenWings('open'), intro.openAt),
      window.setTimeout(() => {
        markIntroSeen();
        setPlayed(true);
      }, intro.doneAt),
    ];
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [ready, phase]);

  const skip = (): void => {
    markIntroSeen();
    setPlayed(true);
    // The skip button is about to disappear: hand the keyboard focus to the main action.
    rootRef.current?.querySelector<HTMLElement>('[data-start]')?.focus();
  };

  return (
    <section
      ref={rootRef}
      className={styles.hero}
      aria-labelledby="landing-title"
      data-phase={phase}
    >
      <PageContainer className={styles.inner}>
        <div className={styles.stage}>
          <div className={cx(styles.spin, phase === 'playing' && 'anim-kite-in')}>
            <Kite wings={wings} size="lg" className={styles.kite} />
          </div>
        </div>
        <div className={styles.text}>
          <span className={cx(styles.eyebrow, line(0).className)} style={line(0).style}>
            {copy.eyebrow}
          </span>
          <h1
            id="landing-title"
            className={cx(styles.title, line(1).className)}
            style={line(1).style}
          >
            {copy.title}
          </h1>
          <p className={cx(styles.lead, line(2).className)} style={line(2).style}>
            {fill(home.introLead, { quickStart: auditScope.quickStartQuestions })}
          </p>
          <div className={cx(styles.actions, line(3).className)} style={line(3).style}>
            <Button href={startHref} size="lg" data-start="">
              {copy.primaryCta}
            </Button>
            <Button href="#how" size="lg" variant="outline">
              {copy.secondaryCta}
            </Button>
          </div>
        </div>
      </PageContainer>
      {ready && phase === 'playing' ? (
        <div className={styles.skipSlot}>
          <Button variant="outline" size="sm" onClick={skip}>
            {home.skipIntro}
          </Button>
        </div>
      ) : null}
    </section>
  );
}
