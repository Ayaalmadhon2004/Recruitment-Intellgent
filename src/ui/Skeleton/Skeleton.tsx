import type { CSSProperties, ReactNode } from 'react';
import { cx } from '../internal/cx';
import styles from './Skeleton.module.css';

export type SkeletonShape = 'line' | 'block' | 'circle' | 'pill';

export type SkeletonProps = {
  /** line: one row of text. block: a card or image area. circle: a ring or avatar. pill: a button or tag. */
  shape?: SkeletonShape;
  /** Any CSS length; pass a token such as `var(--space-9)` or a percentage. Lines default to full width. */
  width?: string;
  /** Any CSS length. Lines default to one text line; blocks should state their height. */
  height?: string;
  /** Reserves the width/height ratio (for example "16 / 9") so the shape never collapses. */
  aspectRatio?: string;
  className?: string;
};

/** One placeholder shape. Decorative: hidden from assistive technology. Wrap shapes in a SkeletonGroup. */
export function Skeleton({
  shape = 'block',
  width,
  height,
  aspectRatio,
  className,
}: SkeletonProps): ReactNode {
  const style: CSSProperties = { width, height, aspectRatio };
  return (
    <span aria-hidden="true" className={cx(styles.shape, styles[shape], className)} style={style} />
  );
}

export type SkeletonGroupProps = {
  /** Announced once to screen readers, for example "Loading your report". Comes from `en`. */
  label: string;
  children: ReactNode;
  className?: string;
};

/** The loading region: one status message for assistive technology, the shapes hidden, `aria-busy` set. */
export function SkeletonGroup({ label, children, className }: SkeletonGroupProps): ReactNode {
  return (
    <div role="status" aria-busy="true" className={cx(styles.group, className)}>
      <span className="visually-hidden">{label}</span>
      <div aria-hidden="true" className={styles.shapes}>
        {children}
      </div>
    </div>
  );
}
