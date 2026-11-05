import type { Metadata } from 'next';
import { Suspense } from 'react';
import type { ReactNode } from 'react';
import { ServiceGate } from '../ServiceGate';
import { en } from '@/domain/copy';
import { SignInSkeleton } from '@/features/accounts';
import { SignInRoute } from './SignInRoute';

export const metadata: Metadata = {
  title: en.accounts.meta.signInTitle,
  description: en.seo.pages.signIn,
};

/** Composes the Sign in screen. */
export default function Page(): ReactNode {
  return (
    <ServiceGate>
      <Suspense fallback={<SignInSkeleton />}>
        <SignInRoute />
      </Suspense>
    </ServiceGate>
  );
}
