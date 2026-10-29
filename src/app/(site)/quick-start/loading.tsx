import type { ReactNode } from 'react';
import { QuickStartSkeleton } from '@/features/quick-start';
import { PageContainer } from '@/shell';

/** Shown while the Quick Start route loads, in the same frame as the page. */
export default function Loading(): ReactNode {
  return (
    <PageContainer>
      <QuickStartSkeleton />
    </PageContainer>
  );
}
