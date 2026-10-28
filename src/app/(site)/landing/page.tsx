import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { en } from '@/domain/copy';
import { LandingPage } from '@/features/landing';

export const metadata: Metadata = {
  title: en.landing.meta.title,
  description: en.landing.meta.description,
};

export default function Page(): ReactNode {
  return <LandingPage />;
}
