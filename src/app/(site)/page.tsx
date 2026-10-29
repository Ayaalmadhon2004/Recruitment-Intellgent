import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { auditScope } from '@/domain/config';
import { en, fill } from '@/domain/copy';
import { LandingPage } from '@/features/landing';

export const metadata: Metadata = {
  title: en.landing.meta.title,
  description: fill(en.landing.meta.description, { quickStart: auditScope.quickStartQuestions }),
};

/** The home page is the landing feature. */
export default function Page(): ReactNode {
  return <LandingPage />;
}
