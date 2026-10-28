import type { ReactNode } from 'react';
import { PaperFoldMark } from '@/ui';
import styles from './SiteFooter.module.css';

export type SiteFooterProps = {
  brandLine: string;
  navLabel?: string;
  navItems?: readonly { href: string; label: string }[];
  link: { href: string; label: string };
};

export function SiteFooter({ brandLine, navLabel, navItems = [], link }: SiteFooterProps): ReactNode {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span className={styles.brand}>
          <PaperFoldMark size={36} />
          {brandLine}
        </span>
        {navItems.length > 0 ? (
          <nav aria-label={navLabel} className={styles.nav}>
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className={styles.link}>
                {item.label}
              </a>
            ))}
          </nav>
        ) : null}
        <a href={link.href} className={styles.link}>
          {link.label}
        </a>
      </div>
    </footer>
  );
}
