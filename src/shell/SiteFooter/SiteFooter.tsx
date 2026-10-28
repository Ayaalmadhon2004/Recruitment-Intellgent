import type { ReactNode } from 'react';
import { PaperFoldMark } from '@/ui';
import styles from './SiteFooter.module.css';

export type SiteFooterProps = {
  brandLine: string;
  link: { href: string; label: string };
};

export function SiteFooter({ brandLine, link }: SiteFooterProps): ReactNode {
  return (
    <footer className={styles.footer} data-print="hide">
      <div className={styles.inner}>
        <span className={styles.brand}>
          <PaperFoldMark size={36} />
          {brandLine}
        </span>
        <a href={link.href} className={styles.link}>
          {link.label}
        </a>
      </div>
    </footer>
  );
}
