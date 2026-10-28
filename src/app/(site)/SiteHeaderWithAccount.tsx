'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { routes } from '@/domain/config';
import { en } from '@/domain/copy';
import { getDefaultRuntime, signOutAndClear, useAccountSession } from '@/features/accounts';
import { SiteHeader } from '@/shell';
import type { SiteHeaderProps } from '@/shell';

/** The site header with the sign-in state read from the account session. Shows no auth control while it loads. */
export function SiteHeaderWithAccount(props: Omit<SiteHeaderProps, 'account'>): ReactNode {
  const router = useRouter();
  const [runtime] = useState(() => getDefaultRuntime());
  const { session, refresh } = useAccountSession(runtime);
  const ready = session.status === 'signed-in' || session.status === 'signed-out';

  const onSignOut = (): void => {
    void signOutAndClear(runtime).then(() => {
      refresh();
      router.push(routes.home);
    });
  };

  return (
    <SiteHeader
      {...props}
      account={
        ready
          ? {
              signIn: { href: routes.signIn, label: en.header.signIn },
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
