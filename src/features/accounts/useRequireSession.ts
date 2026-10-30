'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import type { AccountSession } from './useAccountSession';
import { signInHrefFor } from './return-to';

/**
 * The one sign-in rule for gated pages: someone who is not signed in is sent straight to
 * /sign-in?next=<this page>, and nothing protected renders first. A session that could not be read counts
 * as signed out.
 */
export function useRequireSession(session: AccountSession): {
  allowed: boolean;
  redirecting: boolean;
} {
  const router = useRouter();
  const redirecting = session.status === 'signed-out' || session.status === 'error';

  useEffect(() => {
    if (!redirecting) return;
    router.replace(signInHrefFor(`${window.location.pathname}${window.location.search}`));
  }, [redirecting, router]);

  return { allowed: session.status === 'signed-in', redirecting };
}
