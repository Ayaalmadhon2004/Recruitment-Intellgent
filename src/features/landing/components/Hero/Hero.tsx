import type { ReactNode } from 'react';
import { auditScope } from '@/domain/config';
import { en, fill } from '@/domain/copy';
import { SampleDataBadge } from '@/patterns';
import { PageContainer } from '@/shell';
import { Button, PhotoBox, Reveal } from '@/ui';
import styles from './Hero.module.css';

const copy = en.landing.hero;

export type HeroProps = {
  startHref: string;
};

/** Illustrative only: the chip beside the photo is a sample, never a real result. */
const SAMPLE_FRACTION = 0.68;
const RING_RADIUS = 17;
const FULL_TURN = Math.PI + Math.PI;
const RING_LENGTH = FULL_TURN * RING_RADIUS;

export function Hero({ startHref }: HeroProps): ReactNode {
  return (
    <section className={styles.hero} aria-labelledby="landing-title">
      <PageContainer className={styles.inner}>
        <Reveal className={styles.text}>
          <span className={styles.eyebrow}>{copy.eyebrow}</span>
          <h1 id="landing-title" className={styles.title}>
            {copy.title}
          </h1>
          <p className={styles.lead}>{fill(copy.lead, { quickStart: auditScope.quickStartQuestions })}</p>
          <div className={styles.actions}>
            <Button href={startHref} size="lg">
              {copy.primaryCta}
            </Button>
            <Button href="#how" size="lg" variant="inverse-outline">
              {copy.secondaryCta}
            </Button>
          </div>
        </Reveal>
        <Reveal delay={2} className={styles.visual}>
          <div className={styles.photo}>
            <PhotoBox
              shape="arch"
              width={300}
              height={400}
              src="/temp-assets/temp-graduate.jpg"
              alt={copy.photoAlt}
            />
          </div>
          <div className={`${styles.chip}`}>
            <svg viewBox="0 0 44 44" width="44" height="44" aria-hidden="true" focusable="false">
              <circle cx="22" cy="22" r={RING_RADIUS} className={styles.track} />
              <circle
                cx="22"
                cy="22"
                r={RING_RADIUS}
                className={`${styles.arc} anim-ring`}
                strokeDasharray={`${(SAMPLE_FRACTION * RING_LENGTH).toFixed(1)} 200`}
                transform="rotate(-90 22 22)"
              />
            </svg>
            <span className={styles.chipText}>
              <SampleDataBadge label={copy.chipLabel} variant="outline" />
              <span className={styles.chipScore}>{copy.chipScore}</span>
            </span>
          </div>
        </Reveal>
      </PageContainer>
      <svg
        className={styles.slope}
        viewBox="0 0 1440 70"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <polygon points="0,70 1440,0 1440,70" />
      </svg>
    </section>
  );
}
