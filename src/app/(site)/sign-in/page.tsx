import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { en } from '@/domain/copy';
import { SignInPage } from '@/features/accounts';

export const metadata: Metadata = { title: en.accounts.meta.signInTitle };

/** Composes the Sign in screen. */
export default function Page(): ReactNode {
  return <SignInPage />;
}
