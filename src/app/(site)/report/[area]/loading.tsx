import type { ReactNode } from 'react';
import { ScoreDetailPageLoading } from '@/features/report';
import { PageContainer } from '@/shell';

/** Shown while a score detail route loads, in the same frame as the page. */
export default function Loading(): ReactNode {
  return (
    <PageContainer>
      <ScoreDetailPageLoading />
    </PageContainer>
  );
}
