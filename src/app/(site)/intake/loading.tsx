import type { ReactNode } from 'react';
import { IntakeSkeleton } from '@/features/intake';
import { PageContainer } from '@/shell';

/** Shown while the route loads, in the same frame as the page. */
export default function Loading(): ReactNode {
  return (
    <PageContainer>
      <IntakeSkeleton />
    </PageContainer>
  );
}
