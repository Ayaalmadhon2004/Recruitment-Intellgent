import type { ReactNode } from 'react';
import { uiCopy } from '@/design/ui-copy';
import { stagesConfig } from '@/domain/config';
import { en } from '@/domain/copy';
import { Reveal } from '@/ui';
import styles from './WhatYouGet.module.css';

const copy = en.landing.get;
const home = uiCopy.home;

/** The scale every score is reported on, stated in the existing "out of 100" copy. */
const SCORE_SCALE = '100';

const ITEMS = [
  { key: 'scores', figure: SCORE_SCALE, unit: copy.scores.ringCaption },
  { key: 'stage', figure: String(stagesConfig.stages.length), unit: home.stagesUnit },
  { key: 'steps', figure: home.stepsFigure, unit: '' },
] as const;

/** Three outcomes as plain data: a big figure or word, then what it means. No cards, no boxes. */
export function WhatYouGet(): ReactNode {
  return (
    <ul className={styles.grid}>
      {ITEMS.map((item, i) => (
        <li key={item.key} className={styles.item}>
          <Reveal index={i} className={styles.reveal}>
            <p className={styles.figure}>
              <span className={styles.big}>{item.figure}</span>
              {item.unit ? <span className={styles.unit}>{item.unit}</span> : null}
            </p>
            <h3 className={styles.title}>{copy[item.key].title}</h3>
            <p className={styles.body}>{copy[item.key].body}</p>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
