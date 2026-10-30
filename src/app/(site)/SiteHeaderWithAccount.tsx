'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';
import { routes } from '@/domain/config';
import { en } from '@/domain/copy';
import {
  getDefaultRuntime,
  signInHrefFor,
  signOutAndClear,
  useAccountSession,
} from '@/features/accounts';
import { SiteHeader } from '@/shell';
import type { SiteHeaderProps } from '@/shell';

const noSubscription = (): (() => void) => () => undefined;
const readSearch = (): string => window.location.search;

/** The site header with the sign-in state read from the account session. Shows no auth control while it loads. */
export function SiteHeaderWithAccount(props: Omit<SiteHeaderProps, 'account'>): ReactNode {
  const router = useRouter();
  const [runtime] = useState(() => getDefaultRuntime());
  const { session, refresh } = useAccountSession(runtime);
  const pathname = usePathname();
  // The query is read in the browser only (empty on the server), so this header needs no Suspense boundary.
  // The component re-renders on every navigation through usePathname, which refreshes the snapshot.
  const search = useSyncExternalStore(noSubscription, readSearch, () => '');
  const here = `${pathname}${search}`;
  const ready = session.status === 'signed-in' || session.status === 'signed-out';

  const onSignOut = (): void => {
    void signOutAndClear(runtime).then(() => {
      refresh();
      router.push(routes.home);
    });
  };

  const signedOut = ready && session.user === undefined;
  // On the sign-in page itself, "next" must not point back at it.
  const signInHref = pathname === routes.signIn ? routes.signIn : signInHrefFor(here);

  return (
    <SiteHeader
      {...props}
      cta={signedOut ? { ...props.cta, href: signInHrefFor(props.cta.href) } : props.cta}
      account={
        ready
          ? {
              signIn: { href: signInHref, label: en.header.signIn },
              user: session.user ?? null,
              menuLabel: en.header.accountMenu,
              signedInAsLabel: en.header.signedInAs,
              myAudits: { href: routes.dashboard, label: en.header.myAudits },
              signOutLabel: en.header.signOut,
              onSignOut,
            }
          : undefined
      }
    />
  );
}
