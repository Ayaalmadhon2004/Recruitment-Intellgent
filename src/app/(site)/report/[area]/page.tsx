import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { en } from '@/domain/copy';
import { RequireSession } from '@/features/accounts';
import { ScoreDetailPage } from '@/features/report';
import { PageContainer } from '@/shell';

export const metadata: Metadata = { title: en.reportPage.scoreDetailPageTitle };

type PageProps = { params: Promise<{ area: string }> };

export default async function Page({ params }: PageProps): Promise<ReactNode> {
  const { area } = await params;
  return (
    <PageContainer>
      <RequireSession>
        <ScoreDetailPage area={area} />
      </RequireSession>
    </PageContainer>
  );
}
