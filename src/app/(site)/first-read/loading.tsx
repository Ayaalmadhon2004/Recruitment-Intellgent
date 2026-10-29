import type { ReactNode } from 'react';
import { FirstReadPageLoading } from '@/features/quick-start';
import { PageContainer } from '@/shell';

/** Shown while the First Read route loads, in the same frame as the page. */
export default function Loading(): ReactNode {
  return (
    <PageContainer>
      <FirstReadPageLoading />
    </PageContainer>
  );
}
