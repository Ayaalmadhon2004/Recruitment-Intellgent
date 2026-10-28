import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { en } from '@/domain/copy';
import { IntakePage } from '@/features/intake';
import { PageContainer } from '@/shell';

export const metadata: Metadata = { title: en.intake.pageTitle };

/** Composes the Intake feature. */
export default function Page(): ReactNode {
  return (
    <PageContainer as="main">
      <IntakePage reportHref="/report" exitHref="/" />
    </PageContainer>
  );
}
