import type { ReactNode } from 'react';
import { en } from '@/domain/copy';
import { SampleDataBadge } from '@/patterns';
import { AnimatedNumber, Card, cx } from '@/ui';
import { fill, usd } from '../format';
import styles from './PeerChart.module.css';

const PERCENT = 100;

export type PeerRow = { id: string; name: string; netUsd: number };

export type PeerChartProps = {
  youNetUsd: number;
  /** Sample peers. Never real institutions. */
  peers: readonly PeerRow[];
  /** The largest value the bars are scaled against at least (the top band boundary). */
  scaleMinUsd: number;
};

/** Bars are a list with the value written as text on every row, so colour never carries the data. */
export function PeerChart({ youNetUsd, peers, scaleMinUsd }: PeerChartProps): ReactNode {
  const rows = [
    { id: 'you', name: en.costCalc.peers.you, netUsd: youNetUsd, me: true },
    ...peers.map((p) => ({ ...p, me: false })),
  ];
  const scale = Math.max(scaleMinUsd, ...rows.map((r) => r.netUsd));
  const lower = peers.filter((p) => youNetUsd < p.netUsd).length;
  return (
    <Card radius="lg" className={styles.card}>
      <ul className={styles.list} aria-label={en.costCalc.peers.listLabel}>
        {rows.map((r) => (
          <li key={r.id} className={styles.item}>
            <span className={cx(styles.name, r.me && styles.me)}>{r.name}</span>
            <span className={styles.track} aria-hidden="true">
              <span
                className={cx(styles.fill, r.me ? styles.youFill : styles.peerFill, 'anim-grow')}
                style={{ width: `${((r.netUsd / scale) * PERCENT).toFixed(1)}%` }}
              />
            </span>
            <span className={styles.value}>
              <AnimatedNumber value={r.netUsd} format={usd} />
            </span>
          </li>
        ))}
      </ul>
      <p className={styles.note}>
        {fill(en.costCalc.peers.note, { count: lower, total: peers.length })}
      </p>
    </Card>
  );
}

export function PeerSampleBadge(): ReactNode {
  return <SampleDataBadge label={en.costCalc.peers.sampleBadge} variant="outline" />;
}
