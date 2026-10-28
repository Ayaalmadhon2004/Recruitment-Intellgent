import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { en } from '@/domain/copy';
import { CostCalculator } from '@/features/cost-calc';
import { costSample } from '@/fixtures/costSample';

export const metadata: Metadata = { title: en.costCalc.meta.title };

/** Composes the feature only. Start values and peers are labelled sample data. */
export default function Page(): ReactNode {
  return (
    <CostCalculator initial={costSample.start} peers={costSample.peers} />
  );
}
