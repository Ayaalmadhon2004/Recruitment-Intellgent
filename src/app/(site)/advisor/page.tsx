import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { en } from '@/domain/copy';
import { AdvisorRequest } from '@/features/advisor';

export const metadata: Metadata = { title: en.advisor.pageTitle };

export default function Page(): ReactNode {
  return <AdvisorRequest />;
}
