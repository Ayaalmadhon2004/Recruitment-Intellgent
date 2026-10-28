import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { routes } from '@/domain/config';
import { en } from '@/domain/copy';
import { AccountIntake } from '@/features/accounts';
import { PageContainer } from '@/shell';

export const metadata: Metadata = { title: en.intake.pageTitle };

/** Composes the Intake, saving to the account as well when someone is signed in. */
export default function Page(): ReactNode {
  return (
    <PageContainer>
      <AccountIntake reportHref={routes.report} exitHref={routes.dashboard} />
    </PageContainer>
  );
}
