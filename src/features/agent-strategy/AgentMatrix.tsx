import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode, RefObject } from 'react';
import { strategyCopy } from '@/design/ui-copy';
import { en, t } from '@/domain/copy';
import { strongestAndWeakest, weightedAgentScore } from '@/domain/scoring';
import type { AgentFactor } from '@/domain/types';
import type { RatingRange } from '@/domain/scoring';
import { ArchSheet, Icon, cx } from '@/ui';
import { fill } from './format';
import type { SampleAgent } from './types';
import styles from './AgentStrategy.module.css';

const copy = en.agentStrategy.matrix;
const PERCENT = 100;
const SCORE_DECIMALS = 2;
const EDGE_TOLERANCE_PX = 1;
/** Ratings at or below this draw a red bar. The number is always printed too, so colour is never the only cue. */
const LOW_RATING_MAX = 2;

type ScrollEdges = { atStart: boolean; atEnd: boolean };

/** Tracks whether a horizontal scroller has more content on either side, so the edges can fade. */
function useScrollEdges(): {
  ref: RefObject<HTMLDivElement | null>;
  edges: ScrollEdges;
  update: () => void;
} {
  const ref = useRef<HTMLDivElement | null>(null);
  const [edges, setEdges] = useState<ScrollEdges>({ atStart: true, atEnd: true });
  const update = useCallback((): void => {
    const el = ref.current;
    if (!el) return;
    const atStart = el.scrollLeft <= EDGE_TOLERANCE_PX;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - EDGE_TOLERANCE_PX;
    setEdges((prev) =>
      prev.atStart === atStart && prev.atEnd === atEnd ? prev : { atStart, atEnd },
    );
  }, []);
  useEffect(() => {
    update();
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [update]);
  return { ref, edges, update };
}

type ScoreBadgeProps = { score: string; max: number; large?: boolean };

/** Overall score in a navy ring. The full "n / max" text is there for assistive tech; the ring shows it big. */
function ScoreBadge({ score, max, large = false }: ScoreBadgeProps): ReactNode {
  return (
    <span className={cx(styles.badge, large && styles.badgeLarge)}>
      <span className="visually-hidden">{fill(copy.score, { score, max })}</span>
      <span aria-hidden="true" className={styles.badgeNum}>
        {score}
      </span>
      <span aria-hidden="true" className={styles.badgeMax}>
        {fill(copy.scoreMax, { max })}
      </span>
    </span>
  );
}

export type AgentMatrixProps = {
  factors: readonly AgentFactor[];
  rating: RatingRange;
  agents: readonly SampleAgent[];
  /** Agent whose strengths and weaknesses sheet starts open. */
  initialOpenId?: string;
};

/** Real table: caption, column and row headers, a sticky first column inside a focusable scroll region. Each agent name opens a sheet with that agent's strongest and weakest factor. */
export function AgentMatrix({
  factors,
  rating,
  agents,
  initialOpenId,
}: AgentMatrixProps): ReactNode {
  const { ref, edges, update } = useScrollEdges();
  const [openId, setOpenId] = useState<string | null>(initialOpenId ?? null);
  const rows = agents.map((agent) => ({
    agent,
    score: weightedAgentScore(agent.ratings, factors, rating),
  }));
  const opened = rows.find((r) => r.agent.id === openId) ?? null;
  const extremes = opened ? strongestAndWeakest(opened.agent.ratings, factors) : null;
  const factorName = (id: string): string => {
    const factor = factors.find((f) => f.id === id);
    return factor ? t(factor.nameKey) : id;
  };

  return (
    <>
      <div
        className={cx(
          styles.scrollFrame,
          !edges.atStart && styles.fadeStart,
          !edges.atEnd && styles.fadeEnd,
        )}
      >
        <div
          ref={ref}
          role="region"
          aria-label={copy.regionLabel}
          tabIndex={0}
          className={styles.scroll}
          onScroll={update}
        >
          <table role="table" className={styles.table}>
            <caption role="caption" className={styles.caption}>
              {fill(copy.caption, { max: rating.max })}
            </caption>
            <thead role="rowgroup">
              <tr role="row">
                <th scope="col" role="columnheader" className={cx(styles.th, styles.stickyHead)}>
                  {copy.agentHeader}
                </th>
                {factors.map((factor) => (
                  <th key={factor.id} scope="col" role="columnheader" className={styles.th}>
                    {fill(copy.factorHeader, { name: t(factor.nameKey), weight: factor.weight })}
                  </th>
                ))}
                <th scope="col" role="columnheader" className={cx(styles.th, styles.scoreHead)}>
                  {copy.scoreHeader}
                </th>
              </tr>
            </thead>
            <tbody role="rowgroup">
              {rows.map(({ agent, score }) => (
                <tr key={agent.id} role="row" className={styles.row}>
                  <th scope="row" role="rowheader" className={styles.rowHead}>
                    <button
                      type="button"
                      aria-haspopup="dialog"
                      aria-label={fill(strategyCopy.agentDetailsAria, { name: agent.name })}
                      className={styles.agentButton}
                      onClick={() => setOpenId(agent.id)}
                    >
                      <span className={styles.agentText}>
                        <span className={styles.agentName}>{agent.name}</span>
                        <span className={styles.agentState}>{strategyCopy.agentDetails}</span>
                      </span>
                      <Icon name="chevron-right" size={20} strokeWidth={2.4} />
                    </button>
                  </th>
                  {factors.map((factor) => {
                    const value = agent.ratings[factor.id];
                    return (
                      <td
                        key={factor.id}
                        role="cell"
                        className={styles.cell}
                        data-label={t(factor.nameKey)}
                      >
                        <span className={styles.rating}>
                          {fill(copy.rating, { value, max: rating.max })}
                        </span>
                        <span className={styles.bar} aria-hidden="true">
                          <span
                            className={cx(styles.barFill, value <= LOW_RATING_MAX && styles.barLow)}
                            style={{ width: `${(value / rating.max) * PERCENT}%` }}
                          />
                        </span>
                      </td>
                    );
                  })}
                  <td role="cell" className={cx(styles.cell, styles.total)}>
                    <ScoreBadge score={score.toFixed(SCORE_DECIMALS)} max={rating.max} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ArchSheet
        open={opened !== null}
        onClose={() => setOpenId(null)}
        title={opened?.agent.name ?? ''}
      >
        {opened && extremes ? (
          <div className={styles.sheetBody}>
            <p className={styles.sheetScore}>
              <span className={styles.eyebrow}>{strategyCopy.sheetScore}</span>
              <ScoreBadge score={opened.score.toFixed(SCORE_DECIMALS)} max={rating.max} large />
            </p>
            <dl className={styles.sheetList}>
              <div className={styles.sheetItem}>
                <dt className={cx(styles.sheetTerm, styles.termStrength)}>
                  <Icon name="check-circle" size={20} strokeWidth={2.4} />
                  {strategyCopy.sheetStrength}
                </dt>
                <dd className={cx(styles.sheetDef, styles.defStrength)}>
                  {fill(copy.factorRating, {
                    factor: factorName(extremes.strongest.id),
                    rating: extremes.strongest.rating,
                  })}
                </dd>
              </div>
              <div className={styles.sheetItem}>
                <dt className={cx(styles.sheetTerm, styles.termWeakness)}>
                  <Icon name="concern" size={20} strokeWidth={2.4} />
                  {strategyCopy.sheetWeakness}
                </dt>
                <dd className={cx(styles.sheetDef, styles.defWeakness)}>
                  {fill(copy.factorRating, {
                    factor: factorName(extremes.weakest.id),
                    rating: extremes.weakest.rating,
                  })}
                </dd>
              </div>
            </dl>
            <p className={styles.samplePill}>{strategyCopy.sheetSample}</p>
          </div>
        ) : null}
      </ArchSheet>
    </>
  );
}
