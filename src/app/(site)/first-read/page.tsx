import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { en } from '@/domain/copy';
import { PageContainer } from '@/shell';
import { FirstReadRoute } from './FirstReadRoute';

export const metadata: Metadata = { title: en.quickStart.firstReadPageTitle };

export default function Page(): ReactNode {
  return (
    <PageContainer>
      <FirstReadRoute />
    </PageContainer>
  );
}
