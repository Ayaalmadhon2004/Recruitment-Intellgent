import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { ServiceGate } from '../ServiceGate';
import { en } from '@/domain/copy';
import { DashboardPage } from '@/features/accounts';

export const metadata: Metadata = {
  title: en.accounts.meta.dashboardTitle,
  description: en.seo.pages.dashboard,
};

/** Composes the Dashboard of saved audits. */
export default function Page(): ReactNode {
  return (
    <ServiceGate>
      <DashboardPage />
    </ServiceGate>
  );
}
