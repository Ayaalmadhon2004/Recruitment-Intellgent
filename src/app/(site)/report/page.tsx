import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { en } from '@/domain/copy';
import { RequireSession } from '@/features/accounts';
import { ReportPage } from '@/features/report';
import { PageContainer } from '@/shell';

export const metadata: Metadata = { title: en.reportPage.pageTitle };

export default function Page(): ReactNode {
  return (
    <PageContainer>
      <RequireSession>
        <ReportPage />
      </RequireSession>
    </PageContainer>
  );
}
