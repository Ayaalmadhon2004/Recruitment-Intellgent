import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { en } from '@/domain/copy';
import { FirstReadPage } from '@/features/quick-start';
import { PageContainer } from '@/shell';

export const metadata: Metadata = { title: en.quickStart.firstReadPageTitle };

export default function Page(): ReactNode {
  return (
    <PageContainer as="main">
      <FirstReadPage />
    </PageContainer>
  );
}
