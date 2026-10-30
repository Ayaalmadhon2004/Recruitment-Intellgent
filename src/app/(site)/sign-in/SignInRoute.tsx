'use client';

import { useSearchParams } from 'next/navigation';
import type { ReactNode } from 'react';
import { routes } from '@/domain/config';
import { SignInPage } from '@/features/accounts';

/** Only these pages may be asked for as the place to go after signing in. */
const returnTargets: readonly string[] = [routes.quickStart, routes.dashboard, routes.report];

/** The Sign in screen. `?next=` names where to go afterwards, from the fixed list above. */
export function SignInRoute(): ReactNode {
  const next = useSearchParams().get('next');
  return <SignInPage nextHref={returnTargets.find((href) => href === next)} />;
}
