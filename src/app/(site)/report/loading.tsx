import type { ReactNode } from 'react';
import { ReportPageLoading } from '@/features/report';
import { PageContainer } from '@/shell';

/** Shown while the report route loads, in the same frame as the page. */
export default function Loading(): ReactNode {
  return (
    <PageContainer>
      <ReportPageLoading />
    </PageContainer>
  );
}
