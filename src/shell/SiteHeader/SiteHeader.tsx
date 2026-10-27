import Image from 'next/image';
import type { ReactNode } from 'react';
import styles from './SiteHeader.module.css';

export type NavItem = { href: string; label: string };

export type SiteHeaderProps = {
  logoSrc: string;
  logoAlt: string;
  productName: string;
  navLabel: string;
  navItems: readonly NavItem[];
  cta: NavItem;
};

export function SiteHeader({
  logoSrc,
  logoAlt,
  productName,
  navLabel,
  navItems,
  cta,
}: SiteHeaderProps): ReactNode {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <Image
          src={logoSrc}
          alt={logoAlt}
          width={611}
          height={139}
          className={styles.logo}
          priority
        />
        <span className={styles.product}>{productName}</span>
      </div>
      <nav aria-label={navLabel} className={styles.nav}>
        {navItems.map((item) => (
          <a key={item.href} href={item.href} className={styles.link}>
            {item.label}
          </a>
        ))}
        <a href={cta.href} className={`${styles.cta} hover-nudge`}>
          {cta.label}
        </a>
      </nav>
    </header>
  );
}
