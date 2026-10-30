import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Icon } from '@/ui';
import styles from './SiteFooter.module.css';

export type FooterLink = { href: string; label: string };

export type FooterColumn = {
  heading: string;
  links: readonly FooterLink[];
};

export type SiteFooterProps = {
  homeHref: string;
  logoSrc: string;
  logoAlt: string;
  productName: string;
  tagline: string;
  navLabel: string;
  /** Internal link groups, rendered inside one labelled footer navigation. */
  columns: readonly FooterColumn[];
  external: { heading: string; link: FooterLink };
  copyright: string;
  /** Optional legal links; leave empty until the pages exist. */
  legalLabel?: string;
  legalLinks?: readonly FooterLink[];
};

export function SiteFooter({
  homeHref,
  logoSrc,
  logoAlt,
  productName,
  tagline,
  navLabel,
  columns,
  external,
  copyright,
  legalLabel,
  legalLinks = [],
}: SiteFooterProps): ReactNode {
  return (
    <footer className={styles.footer} data-print="hide">
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Link href={homeHref} className={styles.logoLink}>
              <Image src={logoSrc} alt={logoAlt} width={611} height={139} className={styles.logo} />
            </Link>
            <p className={styles.product}>{productName}</p>
            <p className={styles.tagline}>{tagline}</p>
          </div>

          <nav aria-label={navLabel} className={styles.columns}>
            {columns.map((column) => (
              <div key={column.heading} className={styles.column}>
                <h2 className={styles.heading}>{column.heading}</h2>
                <ul className={styles.list}>
                  {column.links.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className={`${styles.link} hover-underline`}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          <div className={styles.column}>
            <h2 className={styles.heading}>{external.heading}</h2>
            <a
              href={external.link.href}
              className={`${styles.link} ${styles.external} hover-underline`}
              rel="noopener"
            >
              {external.link.label}
              <Icon name="arrow-right" size={16} />
            </a>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>{copyright}</p>
          {legalLinks.length > 0 ? (
            <nav aria-label={legalLabel} className={styles.legal}>
              {legalLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.legalLink} hover-underline`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
