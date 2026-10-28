import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { en } from '@/domain/copy';
import { DashboardPage } from '@/features/accounts';

export const metadata: Metadata = { title: en.accounts.meta.dashboardTitle };

/** Composes the Dashboard of saved audits. */
export default function Page(): ReactNode {
  return <DashboardPage />;
}
