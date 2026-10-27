import type { ReactNode } from 'react';
import type { ScoreResult } from '@/domain/types';
import styles from './RadarChart.module.css';

export type RadarAxis = {
  id: string;
  label: string;
  result: ScoreResult;
};

export type RadarChartLabels = {
  /** Accessible name of the chart and caption of the table. */
  title: string;
  areaHeader: string;
  scoreHeader: string;
  notScorable: string;
  /** For example "68 out of 100". */
  valueText: (value: number) => string;
};

export type RadarChartProps = {
  axes: readonly RadarAxis[];
  labels: RadarChartLabels;
};

const CX = 160;
const CY = 150;
const R = 100;

const point = (index: number, count: number, fraction: number): [number, number] => {
  const angle = -Math.PI / 2 + (index * 2 * Math.PI) / count;
  return [CX + R * fraction * Math.cos(angle), CY + R * fraction * Math.sin(angle)];
};

const fmt = (p: [number, number]): string => `${p[0].toFixed(1)},${p[1].toFixed(1)}`;

/**
 * Radar of the scored areas. A NotScorable area gets a dashed axis and no point: it is never plotted as 0.
 * Axes are named by an HTML legend and a real table, so the chart is not the only way to read the values.
 */
export function RadarChart({ axes, labels }: RadarChartProps): ReactNode {
  const n = axes.length;
  const ring = (fraction: number): string =>
    axes.map((_, i) => fmt(point(i, n, fraction))).join(' ');
  const plotted = axes.flatMap((axis, i) =>
    axis.result.kind === 'scored' ? [{ axis, i, p: point(i, n, axis.result.value / 100) }] : [],
  );

  return (
    <figure className={styles.figure}>
      <svg viewBox="60 40 200 220" className={styles.svg} aria-hidden="true" focusable="false">
        <polygon points={ring(1)} className={styles.ring} />
        <polygon points={ring(0.5)} className={styles.ringHalf} />
        {axes.map((axis, i) => {
          const [x, y] = point(i, n, 1);
          return (
            <line
              key={axis.id}
              x1={CX}
              y1={CY}
              x2={x}
              y2={y}
              className={axis.result.kind === 'scored' ? styles.axis : styles.axisMissing}
            />
          );
        })}
        {plotted.length >= 3 ? (
          <polygon points={plotted.map((d) => fmt(d.p)).join(' ')} className={styles.data} />
        ) : null}
        {plotted.map((d) => (
          <circle key={d.axis.id} cx={d.p[0]} cy={d.p[1]} r={5} className={styles.dot} />
        ))}
      </svg>
      <figcaption className={styles.legend}>
        {axes.map((axis) => (
          <span key={axis.id}>
            {axis.label}{' '}
            {axis.result.kind === 'scored' ? Math.round(axis.result.value) : labels.notScorable}
          </span>
        ))}
      </figcaption>
      <table className="visually-hidden">
        <caption>{labels.title}</caption>
        <thead>
          <tr>
            <th scope="col">{labels.areaHeader}</th>
            <th scope="col">{labels.scoreHeader}</th>
          </tr>
        </thead>
        <tbody>
          {axes.map((axis) => (
            <tr key={axis.id}>
              <th scope="row">{axis.label}</th>
              <td>
                {axis.result.kind === 'scored'
                  ? labels.valueText(axis.result.value)
                  : labels.notScorable}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
