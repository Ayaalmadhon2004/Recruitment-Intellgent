import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { en } from '@/domain/copy';
import { RequireSession } from '@/features/accounts';
import { UnlockPage } from '@/features/unlock';

export const metadata: Metadata = { title: en.unlock.meta.title };

/** Composes the Unlock screen. The (site) layout supplies the single <main>. */
export default function Page(): ReactNode {
  return (
    <RequireSession>
      <UnlockPage />
    </RequireSession>
  );
}
