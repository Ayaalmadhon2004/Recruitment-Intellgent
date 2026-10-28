import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import styles from './SiteHeader.module.css';

export type NavItem = { href: string; label: string };

export type SiteHeaderProps = {
  homeHref: string;
  logoSrc: string;
  logoAlt: string;
  productName: string;
  navLabel: string;
  navItems: readonly NavItem[];
  cta: NavItem;
};

export function SiteHeader({
  homeHref,
  logoSrc,
  logoAlt,
  productName,
  navLabel,
  navItems,
  cta,
}: SiteHeaderProps): ReactNode {
  return (
    <header className={styles.header} data-print="hide">
      <div className={styles.brand}>
        <Link href={homeHref} className={styles.logoLink}>
          <Image
            src={logoSrc}
            alt={logoAlt}
            width={611}
            height={139}
            className={styles.logo}
            priority
          />
        </Link>
        <span className={styles.product}>{productName}</span>
      </div>
      <nav aria-label={navLabel} className={styles.nav}>
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className={styles.link}>
            {item.label}
          </Link>
        ))}
        <Link href={cta.href} className={`${styles.cta} hover-nudge`}>
          {cta.label}
        </Link>
      </nav>
    </header>
  );
}
