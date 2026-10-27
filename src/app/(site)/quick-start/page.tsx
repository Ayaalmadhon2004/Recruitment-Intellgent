import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { en } from '@/domain/copy';
import { QuickStartFlow } from '@/features/quick-start';
import { PageContainer } from '@/shell';

export const metadata: Metadata = { title: en.quickStart.pageTitle };

export default function Page(): ReactNode {
  return (
    <PageContainer as="main">
      <QuickStartFlow />
    </PageContainer>
  );
}
