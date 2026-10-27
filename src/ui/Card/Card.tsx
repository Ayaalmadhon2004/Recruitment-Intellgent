import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../internal/cx';
import styles from './Card.module.css';

export type CardProps = HTMLAttributes<HTMLElement> & {
  as?: 'div' | 'article' | 'section' | 'li';
  tone?: 'default' | 'navy' | 'dashed';
  radius?: 'sm' | 'md' | 'lg' | 'xl';
  /** Lifts the card on hover. Disabled automatically when reduced motion is requested. */
  lift?: boolean;
  children: ReactNode;
};

export function Card({
  as: Tag = 'div',
  tone = 'default',
  radius = 'md',
  lift,
  className,
  children,
  ...rest
}: CardProps): ReactNode {
  return (
    <Tag
      {...rest}
      className={cx(styles.card, styles[tone], styles[radius], lift && 'hover-lift', className)}
    >
      {children}
    </Tag>
  );
}
