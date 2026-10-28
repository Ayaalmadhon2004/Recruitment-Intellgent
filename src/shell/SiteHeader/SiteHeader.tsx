'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Icon } from '@/ui';
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
  menuOpenLabel: string;
  menuCloseLabel: string;
};

export function SiteHeader({
  homeHref,
  logoSrc,
  logoAlt,
  productName,
  navLabel,
  navItems,
  cta,
  menuOpenLabel,
  menuCloseLabel,
}: SiteHeaderProps): ReactNode {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const navId = useId();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <header className={styles.header} data-print="hide">
      <div className={styles.bar}>
        <div className={styles.brand}>
          <Link href={homeHref} className={styles.logoLink} onClick={() => setOpen(false)}>
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
        <nav
          id={navId}
          aria-label={navLabel}
          className={styles.nav}
          data-open={open ? 'true' : 'false'}
        >
          <ul className={styles.list}>
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={styles.link} onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className={styles.actions}>
          <Link href={cta.href} className={`${styles.cta} hover-nudge`}>
            {cta.label}
          </Link>
          <button
            ref={toggleRef}
            type="button"
            className={styles.toggle}
            aria-expanded={open}
            aria-controls={navId}
            aria-label={open ? menuCloseLabel : menuOpenLabel}
            onClick={() => setOpen((value) => !value)}
          >
            <Icon name={open ? 'close' : 'menu'} size={24} />
          </button>
        </div>
      </div>
    </header>
  );
}
