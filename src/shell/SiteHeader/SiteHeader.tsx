'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Icon } from '@/ui';
import styles from './SiteHeader.module.css';

export type NavItem = { href: string; label: string };

/** Secondary pages grouped under one labelled entry: a dropdown on wide screens, a titled section in the drawer. */
export type NavGroup = { label: string; items: readonly NavItem[] };

export type HeaderAccount = {
  signIn: NavItem;
  /** The signed-in person, or null when signed out. */
  user: { email: string } | null;
  menuLabel: string;
  signedInAsLabel: string;
  myAudits: NavItem;
  signOutLabel: string;
  onSignOut: () => void;
};

/** Up to two initials from the part of the email before the @ (`jane.doe@x.edu` becomes JD). */
export function initialsOf(email: string): string {
  const parts =
    email
      .split('@')[0]
      ?.split(/[^a-z0-9]+/i)
      .filter(Boolean) ?? [];
  const letters =
    parts.length > 1 ? `${parts[0]![0]}${parts[1]![0]}` : (parts[0] ?? '').slice(0, 2);
  return letters.toUpperCase();
}

export type SiteHeaderProps = {
  homeHref: string;
  logoSrc: string;
  logoAlt: string;
  productName: string;
  navLabel: string;
  navItems: readonly NavItem[];
  /** Optional secondary links, kept out of the main row so it stays short. */
  navGroup?: NavGroup;
  cta: NavItem;
  menuOpenLabel: string;
  menuCloseLabel: string;
  /** Leave out while the session is loading or the account feature is off: no auth controls render. */
  account?: HeaderAccount;
};

export function SiteHeader({
  homeHref,
  logoSrc,
  logoAlt,
  productName,
  navLabel,
  navItems,
  navGroup,
  cta,
  menuOpenLabel,
  menuCloseLabel,
  account,
}: SiteHeaderProps): ReactNode {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  const accountToggleRef = useRef<HTMLButtonElement>(null);
  const [groupOpen, setGroupOpen] = useState(false);
  const groupRef = useRef<HTMLLIElement>(null);
  const groupToggleRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const isCurrent = (href: string): boolean =>
    pathname !== null &&
    (href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`));
  const navId = useId();
  const groupId = useId();
  const accountMenuId = useId();

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

  useEffect(() => {
    if (!accountOpen) return;
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== 'Escape') return;
      setAccountOpen(false);
      accountToggleRef.current?.focus();
    };
    const onPointerDown = (event: PointerEvent): void => {
      if (!accountRef.current?.contains(event.target as Node)) setAccountOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [accountOpen]);

  useEffect(() => {
    if (!groupOpen) return;
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== 'Escape') return;
      setGroupOpen(false);
      groupToggleRef.current?.focus();
    };
    const onPointerDown = (event: PointerEvent): void => {
      if (!groupRef.current?.contains(event.target as Node)) setGroupOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [groupOpen]);

  const closeAll = (): void => {
    setOpen(false);
    setGroupOpen(false);
  };

  const signOut = (): void => {
    setOpen(false);
    setAccountOpen(false);
    account?.onSignOut();
  };

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
                <Link
                  href={item.href}
                  className={styles.link}
                  aria-current={isCurrent(item.href) ? 'page' : undefined}
                  onClick={closeAll}
                >
                  <span className={styles.label}>{item.label}</span>
                </Link>
              </li>
            ))}
            {navGroup ? (
              <li ref={groupRef} className={styles.group} data-open={groupOpen ? 'true' : 'false'}>
                <button
                  ref={groupToggleRef}
                  type="button"
                  className={`${styles.link} ${styles.groupToggle}`}
                  aria-expanded={groupOpen}
                  aria-controls={groupId}
                  onClick={() => setGroupOpen((value) => !value)}
                >
                  {navGroup.label}
                  <Icon name="chevron-down" size={16} />
                </button>
                <span className={styles.groupTitle} aria-hidden="true">
                  {navGroup.label}
                </span>
                <ul id={groupId} className={styles.groupList}>
                  {navGroup.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={styles.groupLink}
                        aria-current={isCurrent(item.href) ? 'page' : undefined}
                        onClick={closeAll}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ) : null}
          </ul>
          {account ? (
            <div className={styles.drawerAccount}>
              {account.user ? (
                <>
                  <p className={styles.drawerEmail}>
                    <span className={styles.muted}>{account.signedInAsLabel}</span>{' '}
                    {account.user.email}
                  </p>
                  <button type="button" className={styles.drawerButton} onClick={signOut}>
                    {account.signOutLabel}
                  </button>
                </>
              ) : (
                <Link
                  href={account.signIn.href}
                  className={styles.drawerButton}
                  onClick={() => setOpen(false)}
                >
                  {account.signIn.label}
                </Link>
              )}
            </div>
          ) : null}
        </nav>
        <div className={styles.actions}>
          {account && !account.user ? (
            <Link href={account.signIn.href} className={styles.signIn}>
              {account.signIn.label}
            </Link>
          ) : null}
          <Link href={cta.href} className={`${styles.cta} hover-nudge`}>
            {cta.label}
          </Link>
          {account?.user ? (
            <div ref={accountRef} className={styles.account}>
              <button
                ref={accountToggleRef}
                type="button"
                className={styles.avatar}
                aria-expanded={accountOpen}
                aria-controls={accountMenuId}
                aria-label={`${account.menuLabel}: ${account.user.email}`}
                onClick={() => setAccountOpen((value) => !value)}
              >
                <span aria-hidden="true">{initialsOf(account.user.email)}</span>
              </button>
              <div id={accountMenuId} className={styles.accountMenu} hidden={!accountOpen}>
                <p className={styles.accountEmail}>
                  <span className={styles.muted}>{account.signedInAsLabel}</span>
                  {account.user.email}
                </p>
                <Link
                  href={account.myAudits.href}
                  className={styles.accountItem}
                  onClick={() => setAccountOpen(false)}
                >
                  {account.myAudits.label}
                </Link>
                <button type="button" className={styles.accountItem} onClick={signOut}>
                  {account.signOutLabel}
                </button>
              </div>
            </div>
          ) : null}
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
