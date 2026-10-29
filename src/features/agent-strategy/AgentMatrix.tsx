import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode, RefObject } from 'react';
import { en, t } from '@/domain/copy';
import { strongestAndWeakest, weightedAgentScore } from '@/domain/scoring';
import type { AgentFactor } from '@/domain/types';
import type { RatingRange } from '@/domain/scoring';
import { cx } from '@/ui';
import { fill } from './format';
import type { SampleAgent } from './types';
import styles from './AgentStrategy.module.css';

const copy = en.agentStrategy.matrix;
const PERCENT = 100;
const SCORE_DECIMALS = 2;
const EDGE_TOLERANCE_PX = 1;

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

export type AgentMatrixProps = {
  factors: readonly AgentFactor[];
  rating: RatingRange;
  agents: readonly SampleAgent[];
  selectedId: string;
  onSelect: (id: string) => void;
};

/** Real table: caption, column and row headers, a sticky first column inside a focusable scroll region. Edge fades show when more columns sit off-screen. */
export function AgentMatrix({
  factors,
  rating,
  agents,
  selectedId,
  onSelect,
}: AgentMatrixProps): ReactNode {
  const { ref, edges, update } = useScrollEdges();
  const rows = agents.map((agent) => ({
    agent,
    score: weightedAgentScore(agent.ratings, factors, rating),
  }));
  const picked = rows.find((r) => r.agent.id === selectedId) ?? rows[0];
  const extremes = picked ? strongestAndWeakest(picked.agent.ratings, factors) : null;
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
          <table className={styles.table}>
            <caption className={styles.caption}>{fill(copy.caption, { max: rating.max })}</caption>
            <thead>
              <tr>
                <th scope="col" className={cx(styles.th, styles.stickyHead)}>
                  {copy.agentHeader}
                </th>
                {factors.map((factor) => (
                  <th key={factor.id} scope="col" className={styles.th}>
                    {fill(copy.factorHeader, { name: t(factor.nameKey), weight: factor.weight })}
                  </th>
                ))}
                <th scope="col" className={cx(styles.th, styles.scoreHead)}>
                  {copy.scoreHeader}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ agent, score }) => {
                const on = agent.id === picked?.agent.id;
                return (
                  <tr key={agent.id} className={cx(styles.row, on && styles.rowOn)}>
                    <th scope="row" className={styles.rowHead}>
                      <button
                        type="button"
                        aria-pressed={on}
                        className={cx(styles.agentButton, on && styles.agentButtonOn)}
                        onClick={() => onSelect(agent.id)}
                      >
                        <span className={styles.agentName}>{agent.name}</span>
                        <span className={styles.agentState}>
                          {on ? copy.selected : copy.select}
                        </span>
                      </button>
                    </th>
                    {factors.map((factor) => {
                      const value = agent.ratings[factor.id];
                      return (
                        <td key={factor.id} className={styles.cell}>
                          <span className={styles.rating}>
                            {fill(copy.rating, { value, max: rating.max })}
                          </span>
                          <span className={styles.bar} aria-hidden="true">
                            <span
                              className={styles.barFill}
                              style={{ width: `${(value / rating.max) * PERCENT}%` }}
                            />
                          </span>
                        </td>
                      );
                    })}
                    <td className={cx(styles.cell, styles.total)}>
                      {fill(copy.score, { score: score.toFixed(SCORE_DECIMALS), max: rating.max })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {picked && extremes ? (
        <div className={styles.summary} role="status">
          <div className={styles.summaryMain}>
            <span className={styles.eyebrow}>{copy.summaryEyebrow}</span>
            <span className={styles.summaryTitle}>
              {fill(copy.summaryTitle, {
                name: picked.agent.name,
                score: picked.score.toFixed(SCORE_DECIMALS),
                max: rating.max,
              })}
            </span>
          </div>
          <span className={styles.summaryDetail}>
            {fill(copy.summaryDetail, {
              strongest: fill(copy.factorRating, {
                factor: factorName(extremes.strongest.id),
                rating: extremes.strongest.rating,
              }),
              weakest: fill(copy.factorRating, {
                factor: factorName(extremes.weakest.id),
                rating: extremes.weakest.rating,
              }),
            })}
          </span>
        </div>
      ) : null}
    </>
  );
}
