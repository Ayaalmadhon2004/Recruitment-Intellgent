import type { CSSProperties, ReactNode } from 'react';
import { en, t } from '@/domain/copy';
import type { AgentFactor, AgentFactorId } from '@/domain/types';
import { cx } from '@/ui';
import { fill } from './format';
import styles from './AgentStrategy.module.css';

const copy = en.agentStrategy.weights;

/**
 * Chart colours: one navy hue stepping from dark to light, so segments are told apart by shade and
 * by the legend, not by unrelated hues. They repeat if a config ever has more than seven factors.
 */
export const factorColours = [
  'var(--color-navy-deep)',
  'var(--color-navy)',
  'color-mix(in srgb, var(--color-navy) 82%, var(--color-card))',
  'color-mix(in srgb, var(--color-navy) 66%, var(--color-card))',
  'color-mix(in srgb, var(--color-navy) 52%, var(--color-card))',
  'color-mix(in srgb, var(--color-navy) 40%, var(--color-card))',
  'color-mix(in srgb, var(--color-navy) 30%, var(--color-card))',
] as const;

export const colourFor = (index: number): string =>
  factorColours[index % factorColours.length] ?? factorColours[0];

const RADIUS = 70;
const RADIUS_TO_DIAMETER = 2;
const CIRCUMFERENCE = Math.PI * RADIUS * RADIUS_TO_DIAMETER;
const SEGMENT_GAP = 2;
const FULL = 100;

export type FactorDonutProps = {
  factors: readonly AgentFactor[];
  selectedId: AgentFactorId | null;
  onSelect: (id: AgentFactorId | null) => void;
};

/**
 * Weights as a donut. The SVG only draws the segments. The numbers are HTML text in the centre and in
 * the legend, and the legend buttons are the way to highlight a factor.
 */
export function FactorDonut({ factors, selectedId, onSelect }: FactorDonutProps): ReactNode {
  const total = factors.reduce((sum, f) => sum + f.weight, 0);
  const selected = factors.find((f) => f.id === selectedId) ?? null;
  const segments = factors.map((factor, index) => {
    const length = (factor.weight / FULL) * CIRCUMFERENCE;
    const offset = factors
      .slice(0, index)
      .reduce((sum, f) => sum + (f.weight / FULL) * CIRCUMFERENCE, 0);
    return { factor, index, length, offset };
  });

  return (
    <div className={styles.donutCard}>
      <div className={styles.donut}>
        <svg viewBox="0 0 180 180" className={styles.donutSvg} aria-hidden="true" focusable="false">
          <circle cx="90" cy="90" r={RADIUS} className={styles.donutTrack} />
          {segments.map(({ factor, index, length, offset }) => (
            <circle
              key={factor.id}
              cx="90"
              cy="90"
              r={RADIUS}
              transform="rotate(-90 90 90)"
              strokeDasharray={`${Math.max(0, length - SEGMENT_GAP).toFixed(1)} ${CIRCUMFERENCE.toFixed(1)}`}
              strokeDashoffset={(-offset).toFixed(1)}
              style={{ stroke: colourFor(index) }}
              className={cx(
                styles.segment,
                'anim-ring',
                selectedId !== null && selectedId === factor.id && styles.segmentOn,
                selectedId !== null && selectedId !== factor.id && styles.segmentDim,
              )}
            />
          ))}
        </svg>
        <div className={styles.donutCentre}>
          <span className={styles.donutBig}>{selected ? selected.weight : total}</span>
          <span className={styles.donutSmall}>
            {selected ? t(selected.nameKey) : copy.totalWeight}
          </span>
        </div>
      </div>
      <div className={styles.legendWrap}>
        <span className={styles.hint}>{copy.hint}</span>
        <ul className={styles.legend} aria-label={copy.legendLabel}>
          {factors.map((factor, index) => {
            const on = factor.id === selectedId;
            return (
              <li key={factor.id}>
                <button
                  type="button"
                  aria-pressed={on}
                  className={cx(styles.legendButton, on && styles.legendButtonOn)}
                  onClick={() => onSelect(on ? null : factor.id)}
                >
                  <span
                    aria-hidden="true"
                    className={styles.chip}
                    style={{ background: colourFor(index) } as CSSProperties}
                  />
                  <span className={styles.legendName}>{t(factor.nameKey)}</span>
                  <span className={styles.legendWeight}>
                    {fill(copy.weightText, { weight: factor.weight })}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
