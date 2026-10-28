'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import { en } from '@/domain/copy';
import { TbcValue } from '@/patterns';
import { SectionHeader } from '@/shell';
import { Button, Icon } from '@/ui';
import styles from './FreeOrFull.module.css';

const copy = en.landing.compare;

type Mode = 'free' | 'full';
const MODES: readonly Mode[] = ['free', 'full'];
const BADGE_ICON = 16;

export type FreeOrFullProps = {
  startHref: string;
  /** From tbc.config.pricing. Null until Capstone confirms it. */
  pricing: string | null;
  defaultMode?: Mode;
};

export function FreeOrFull({
  startHref,
  pricing,
  defaultMode = 'free',
}: FreeOrFullProps): ReactNode {
  const [mode, setMode] = useState<Mode>(defaultMode);
  const current = copy[mode];

  return (
    <section id="compare" className={styles.section} aria-labelledby="landing-compare-title">
      <SectionHeader eyebrow={copy.eyebrow} title={copy.title} id="landing-compare-title" />
      <div role="group" aria-label={copy.switchLabel} className={styles.switch}>
        {MODES.map((m) => (
          <button
            key={m}
            type="button"
            aria-pressed={mode === m}
            className={styles.option}
            onClick={() => setMode(m)}
          >
            {copy[m].tab}
          </button>
        ))}
      </div>
      <div key={mode} className={`${styles.panel} anim-pop`}>
        <div className={styles.summary}>
          <h3 className={styles.panelTitle}>{current.title}</h3>
          <p className={styles.sub}>{current.sub}</p>
          <p className={styles.price}>
            <span className="visually-hidden">{copy.priceLabel}: </span>
            {mode === 'free' ? (
              copy.free.price
            ) : (
              <TbcValue value={pricing} placeholder={copy.pricePlaceholder} />
            )}
          </p>
          <Button href={startHref} className={styles.cta}>
            {current.cta}
          </Button>
        </div>
        <ul className={styles.items} aria-label={copy.listLabel}>
          {current.items.map((item) => (
            <li key={item.label} className={styles.row}>
              <span
                className={`${styles.badge} ${item.included ? styles.on : styles.off}`}
                aria-hidden="true"
              >
                <Icon name={item.included ? 'check' : 'lock'} size={BADGE_ICON} />
              </span>
              <span className={styles.label}>{item.label}</span>
              <span className={styles.state}>{item.included ? copy.included : copy.locked}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
