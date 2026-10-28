import type { ReactNode } from 'react';
import { en } from '@/domain/copy';
import { scored } from '@/domain/scoring';
import { SampleDataBadge, ScoreRing } from '@/patterns';
import { SectionHeader } from '@/shell';
import { Card, Reveal } from '@/ui';
import styles from './WhatYouGet.module.css';

const copy = en.landing.get;

/** Illustrative values from the design. Never real results. */
const SAMPLE_SCORE = 78;
const RING_SIZE = 120;
const STAGES = [
  { x: '14', y: '78', height: '24', on: false },
  { x: '40', y: '58', height: '44', on: true },
  { x: '66', y: '38', height: '64', on: false },
  { x: '92', y: '18', height: '84', on: false },
] as const;
const CHECKLIST = [
  { cy: '26', barY: '20', barWidth: '64', done: true },
  { cy: '60', barY: '54', barWidth: '50', done: true },
  { cy: '94', barY: '88', barWidth: '58', done: false },
] as const;

function ScoreIllustration(): ReactNode {
  return (
    <ScoreRing
      result={scored(SAMPLE_SCORE, 'strong', 'high')}
      ariaLabel={copy.scores.ringAria}
      caption={copy.scores.ringCaption}
      size={RING_SIZE}
    />
  );
}

function StageIllustration(): ReactNode {
  return (
    <svg viewBox="0 0 120 120" width="120" height="120" role="img" aria-label={copy.stage.aria}>
      {STAGES.map((s) => (
        <rect
          key={s.x}
          x={s.x}
          y={s.y}
          width="20"
          height={s.height}
          rx="5"
          className={s.on ? styles.stageOn : styles.stageOff}
        />
      ))}
    </svg>
  );
}

function ChecklistIllustration(): ReactNode {
  return (
    <svg viewBox="0 0 120 120" width="120" height="120" role="img" aria-label={copy.steps.aria}>
      {CHECKLIST.map((row) => (
        <g key={row.cy}>
          <circle
            cx="24"
            cy={row.cy}
            r="12"
            className={row.done ? styles.dotDone : styles.dotTodo}
          />
          {row.done ? <path d={`M18 ${row.cy}l4 4 8-8`} className={styles.tick} /> : null}
          <rect
            x="44"
            y={row.barY}
            width={row.barWidth}
            height="12"
            rx="6"
            className={row.done ? styles.barDone : styles.barTodo}
          />
        </g>
      ))}
    </svg>
  );
}

const CARDS = [
  { key: 'scores', art: <ScoreIllustration />, delay: 0 },
  { key: 'stage', art: <StageIllustration />, delay: 1 },
  { key: 'steps', art: <ChecklistIllustration />, delay: 2 },
] as const;

export function WhatYouGet(): ReactNode {
  return (
    <section id="get" className={styles.section} aria-labelledby="landing-get-title">
      <SectionHeader eyebrow={copy.eyebrow} title={copy.title} id="landing-get-title" />
      <ul className={styles.grid}>
        {CARDS.map((c) => (
          <li key={c.key} className={styles.item}>
            <Reveal delay={c.delay} className={styles.reveal}>
              <Card as="article" radius="lg" lift className={styles.card}>
                <div className={styles.art}>{c.art}</div>
                <SampleDataBadge label={en.status.sample} variant="outline" />
                <h3 className={styles.cardTitle}>{copy[c.key].title}</h3>
                <p className={styles.cardBody}>{copy[c.key].body}</p>
              </Card>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
