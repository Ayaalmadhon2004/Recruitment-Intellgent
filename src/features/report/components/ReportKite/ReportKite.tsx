'use client';

import { useId, useState } from 'react';
import type { ReactNode } from 'react';
import { diamondWaveStep } from '@/design/motion';
import { fill } from '@/domain/copy';
import { reportUiCopy } from '@/design/ui-copy';
import { cx } from '@/ui';
import type { CellState, KiteSection } from './cells';
import styles from './ReportKite.module.css';

export type ReportKiteProps = {
  sections: readonly KiteSection[];
  className?: string;
};

const UNIT = 22;
const copy = reportUiCopy.kite;

/** Corner of the lattice: sections run one way, the cells of a section the other, tilted into a diamond. */
const corner = (section: number, cell: number, depth: number): string => {
  const x = (section - cell + depth) * UNIT;
  const y = (section + cell) * UNIT;
  return `${x},${y}`;
};

const cellPoints = (section: number, cell: number, depth: number): string =>
  [
    corner(section, cell, depth),
    corner(section + 1, cell, depth),
    corner(section + 1, cell + 1, depth),
    corner(section, cell + 1, depth),
  ].join(' ');

const legendStates = ['empty', 'strong', 'medium', 'weak'] as const;
const legendText: Record<CellState, string> = {
  empty: copy.empty,
  strong: copy.strong,
  medium: copy.medium,
  weak: copy.weak,
};

/** A swatch shaped like one cell, so the key matches the picture. Weak carries its hatching. */
function Swatch({ state, pattern }: { state: CellState; pattern: string }): ReactNode {
  const points = '12,1 23,12 12,23 1,12';
  return (
    <svg viewBox="0 0 24 24" className={styles.swatch} aria-hidden="true" focusable="false">
      <polygon points={points} className={cx(styles.cell, styles[state])} />
      {state === 'weak' ? (
        <polygon points={points} className={styles.hatch} fill={`url(#${pattern})`} />
      ) : null}
    </svg>
  );
}

/**
 * The audit as a diamond: one cell per question, grouped by section, empty until answered.
 * The picture has a summary label; the lists beside it say the same in words.
 */
export function ReportKite({ sections, className }: ReportKiteProps): ReactNode {
  const patternId = useId();
  const depth = Math.max(...sections.map((s) => s.cells.length));
  const size = (sections.length + depth) * UNIT;
  const total = sections.reduce((n, s) => n + s.cells.length, 0);
  const answered = sections.reduce((n, s) => n + s.answered, 0);

  // Cells filled when the diamond first appears fill in as a wave from the centre section outward,
  // one section at a time. A cell answered later pops in on its own, with no delay.
  const [initial] = useState(
    () =>
      new Set(
        sections.flatMap((section) =>
          section.cells.filter((cell) => cell.state !== 'empty').map((cell) => cell.id),
        ),
      ),
  );
  const middle = (sections.length - 1) / 2;
  const waveRank = [...sections.keys()]
    .sort((a, b) => Math.abs(a - middle) - Math.abs(b - middle) || a - b)
    .reduce<number[]>((ranks, section, rank) => {
      ranks[section] = rank;
      return ranks;
    }, []);

  return (
    <figure className={cx(styles.figure, className)}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className={styles.kite}
        role="img"
        aria-label={fill(copy.label, { answered, total })}
        focusable="false"
      >
        <defs>
          <pattern
            id={patternId}
            width="6"
            height="6"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line x1="0" y1="0" x2="0" y2="6" className={styles.hatchLine} />
          </pattern>
        </defs>
        {sections.map((section, s) =>
          section.cells.map((cell, c) => (
            <g
              key={cell.id}
              className={cell.state === 'empty' ? undefined : 'anim-cell-in'}
              style={
                cell.state !== 'empty' && initial.has(cell.id)
                  ? { animationDelay: `${(waveRank[s] ?? 0) * diamondWaveStep}ms` }
                  : undefined
              }
            >
              <polygon
                points={cellPoints(s, c, depth)}
                className={cx(styles.cell, styles[cell.state])}
              />
              {cell.state === 'weak' ? (
                <polygon
                  points={cellPoints(s, c, depth)}
                  className={styles.hatch}
                  fill={`url(#${patternId})`}
                />
              ) : null}
            </g>
          )),
        )}
      </svg>
      <figcaption className={styles.caption}>
        <ul className={styles.sections} aria-label={copy.sectionsList}>
          {sections.map((section) => (
            <li key={section.id} className={styles.section}>
              <span className={styles.letter} aria-hidden="true">
                {section.id}
              </span>
              <span className={styles.sectionName}>{section.name}</span>
              <span className={styles.sectionCount}>
                {fill(copy.sectionCount, {
                  answered: section.answered,
                  total: section.cells.length,
                })}
              </span>
            </li>
          ))}
        </ul>
        <ul className={styles.legend} aria-label={copy.legendTitle}>
          {legendStates.map((state) => (
            <li key={state} className={styles.legendItem}>
              <Swatch state={state} pattern={patternId} />
              {legendText[state]}
            </li>
          ))}
        </ul>
      </figcaption>
    </figure>
  );
}
