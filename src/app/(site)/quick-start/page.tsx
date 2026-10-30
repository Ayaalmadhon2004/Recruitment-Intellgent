import type { Metadata } from 'next';
import { Suspense } from 'react';
import type { ReactNode } from 'react';
import { en } from '@/domain/copy';
import { QuickStartSkeleton } from '@/features/quick-start';
import { PageContainer } from '@/shell';
import { AuditFlowRoute } from './AuditFlowRoute';

export const metadata: Metadata = { title: en.quickStart.pageTitle };

/** The one audit route: Quick Start questions, free first read, then the rest. */
export default function Page(): ReactNode {
  return (
    <PageContainer>
      <Suspense fallback={<QuickStartSkeleton />}>
        <AuditFlowRoute />
      </Suspense>
    </PageContainer>
  );
}
