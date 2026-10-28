import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { en } from '@/domain/copy';
import { ReportPage } from '@/features/report';
import { PageContainer } from '@/shell';

export const metadata: Metadata = { title: en.reportPage.pageTitle };

export default function Page(): ReactNode {
  return (
    <PageContainer as="main">
      <ReportPage />
    </PageContainer>
  );
}
