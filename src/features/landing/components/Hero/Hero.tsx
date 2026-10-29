import type { ReactNode } from 'react';
import { auditScope } from '@/domain/config';
import { en, fill } from '@/domain/copy';
import type { ScoreAreaId, Scored } from '@/domain/types';
import { ProgressBar, SampleDataBadge, ScoreRing, StatusBadge } from '@/patterns';
import { PageContainer } from '@/shell';
import { Button, Reveal } from '@/ui';
import styles from './Hero.module.css';

const copy = en.landing.hero;

export type HeroProps = {
  startHref: string;
};

/**
 * Illustrative only: a mock of the free report. These numbers are design samples, never the output
 * of the scoring engine, and the whole preview carries the sample badge.
 */
const SAMPLE_OVERALL: Scored = { kind: 'scored', value: 68, band: 'developing', confidence: 'medium' };
const SAMPLE_AREAS: ReadonlyArray<{ id: ScoreAreaId; value: number }> = [
  { id: 'readiness', value: 74 },
  { id: 'affordability', value: 66 },
  { id: 'digital-visibility', value: 58 },
  { id: 'trust-network', value: 41 },
];

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
            <Button href={startHref} size="lg" className="anim-pulse">
              {copy.primaryCta}
            </Button>
            <Button href="#how" size="lg" variant="inverse-outline">
              {copy.secondaryCta}
            </Button>
          </div>
        </Reveal>
        <Reveal delay={2} className={styles.visual}>
          <figure className={styles.report}>
            <figcaption className={styles.reportHead}>
              <span className={styles.reportLabel}>{copy.preview.label}</span>
              <SampleDataBadge label={en.status.sample} variant="outline" />
            </figcaption>
            <div className={styles.summary}>
              <ScoreRing
                result={SAMPLE_OVERALL}
                ariaLabel={copy.preview.ringAria}
                caption={copy.preview.ringCaption}
                size={132}
              />
              <div className={styles.summaryText}>
                <p className={styles.reportTitle}>{copy.preview.title}</p>
                <p className={styles.reportSub}>{copy.preview.subtitle}</p>
                <StatusBadge tone="caution" label={en.bands[SAMPLE_OVERALL.band]} />
              </div>
            </div>
            <p className={styles.areasTitle}>{copy.preview.areasTitle}</p>
            <ul className={styles.areas}>
              {SAMPLE_AREAS.map((area) => (
                <li key={area.id} className={styles.area}>
                  <ProgressBar
                    value={area.value}
                    label={en.areas[area.id]}
                    valueText={fill(copy.preview.areaScore, { value: area.value })}
                  />
                </li>
              ))}
            </ul>
            <p className={styles.footnote}>{copy.preview.footnote}</p>
          </figure>
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
