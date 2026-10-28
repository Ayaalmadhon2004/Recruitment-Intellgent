'use client';

import { useCallback, useEffect, useState } from 'react';
import type { AccountsRuntime } from './runtime';
import type { AccountUser } from './types';

export type AccountSession =
  | { status: 'loading'; user: undefined }
  | { status: 'signed-out'; user: undefined }
  | { status: 'signed-in'; user: AccountUser }
  | { status: 'error'; user: undefined };

/** Who is signed in, read once on the client. `refresh` reads again. */
export function useAccountSession(runtime: AccountsRuntime): {
  session: AccountSession;
  refresh: () => void;
} {
  const [attempt, setAttempt] = useState(0);
  const [session, setSession] = useState<AccountSession>({
    status: 'loading',
    user: undefined,
  });

  useEffect(() => {
    let cancelled = false;
    runtime.service
      .currentUser()
      .then((user): AccountSession =>
        user ? { status: 'signed-in', user } : { status: 'signed-out', user: undefined },
      )
      .catch((): AccountSession => ({ status: 'error', user: undefined }))
      .then((next) => {
        if (!cancelled) setSession(next);
      });
    return () => {
      cancelled = true;
    };
  }, [runtime, attempt]);

  const refresh = useCallback(() => {
    setSession({ status: 'loading', user: undefined });
    setAttempt((n) => n + 1);
  }, []);

  return { session, refresh };
}
