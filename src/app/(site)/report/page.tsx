import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { ServiceGate } from '../ServiceGate';
import { en } from '@/domain/copy';
import { RequireSession } from '@/features/accounts';
import { ReportPage } from '@/features/report';
import { PageContainer } from '@/shell';

export const metadata: Metadata = {
  title: en.reportPage.pageTitle,
  description: en.seo.pages.report,
};

export default function Page(): ReactNode {
  return (
    <ServiceGate>
      <PageContainer>
        <RequireSession>
          <ReportPage />
        </RequireSession>
      </PageContainer>
    </ServiceGate>
  );
}
