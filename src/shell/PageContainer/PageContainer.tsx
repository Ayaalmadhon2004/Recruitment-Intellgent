import type { ReactNode } from 'react';
import styles from './PageContainer.module.css';

export type PageContainerProps = {
  children: ReactNode;
  as?: 'div' | 'main' | 'section';
  className?: string;
};

export function PageContainer({
  children,
  as: Tag = 'div',
  className,
}: PageContainerProps): ReactNode {
  return <Tag className={[styles.container, className].filter(Boolean).join(' ')}>{children}</Tag>;
}
