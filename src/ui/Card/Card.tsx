import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../internal/cx';
import styles from './Card.module.css';

export type CardProps = HTMLAttributes<HTMLElement> & {
  as?: 'div' | 'article' | 'section' | 'li';
  /** `open` drops the box: no fill, no border, just a hairline rule on top. */
  tone?: 'default' | 'navy' | 'dashed' | 'open';
  radius?: 'sm' | 'md' | 'lg' | 'xl';
  /** Coloured top edge in one of the two brand colours. */
  accent?: 'navy' | 'crimson';
  /** Lifts the card on hover. Disabled automatically when reduced motion is requested. */
  lift?: boolean;
  children: ReactNode;
};

export function Card({
  as: Tag = 'div',
  tone = 'default',
  radius = 'md',
  accent,
  lift,
  className,
  children,
  ...rest
}: CardProps): ReactNode {
  return (
    <Tag
      {...rest}
      className={cx(
        styles.card,
        styles[tone],
        styles[radius],
        accent === 'navy' && styles.accentNavy,
        accent === 'crimson' && styles.accentCrimson,
        lift && 'hover-lift',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
