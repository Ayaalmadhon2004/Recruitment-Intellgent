'use client';

import { useSearchParams } from 'next/navigation';
import type { ReactNode } from 'react';
import { routes } from '@/domain/config';
import { uiCopy } from '@/design/ui-copy';
import { SignInPage, sanitizeNext } from '@/features/accounts';

const contextLines: Readonly<Record<string, string>> = {
  [routes.quickStart]: uiCopy.signInContext.quickStart,
  [routes.dashboard]: uiCopy.signInContext.dashboard,
  [routes.report]: uiCopy.signInContext.report,
  [routes.unlock]: uiCopy.signInContext.unlock,
};

/** One short line for the page the person was heading to, if there is one for it. */
const contextFor = (next: string | undefined): string | undefined => {
  if (next === undefined) return undefined;
  const path = next.split(/[?#]/, 1)[0] ?? '';
  const section = contextLines[path] ?? contextLines[`/${path.split('/')[1] ?? ''}`];
  return section;
};

/** The Sign in screen. `?next=` names where to go afterwards: a relative path on this site, or it is ignored. */
export function SignInRoute(): ReactNode {
  const next = sanitizeNext(useSearchParams().get('next'));
  return <SignInPage nextHref={next} contextLine={contextFor(next)} />;
}
