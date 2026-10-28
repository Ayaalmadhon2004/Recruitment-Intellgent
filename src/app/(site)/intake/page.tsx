import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { routes } from '@/domain/config';
import { en } from '@/domain/copy';
import { IntakePage } from '@/features/intake';
import { PageContainer } from '@/shell';

export const metadata: Metadata = { title: en.intake.pageTitle };

/** Composes the Intake feature. */
export default function Page(): ReactNode {
  return (
    <PageContainer>
      <IntakePage reportHref={routes.report} exitHref={routes.home} />
    </PageContainer>
  );
}
