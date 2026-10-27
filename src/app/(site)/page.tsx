import type { ReactNode } from 'react';
import { en } from '@/domain/copy';
import { PageContainer, SectionHeader } from '@/shell';

/** Temporary home. Replaced by the landing feature. */
export default function Page(): ReactNode {
  return (
    <PageContainer as="main">
      <SectionHeader eyebrow={en.foundation.eyebrow} title={en.foundation.title} />
    </PageContainer>
  );
}
