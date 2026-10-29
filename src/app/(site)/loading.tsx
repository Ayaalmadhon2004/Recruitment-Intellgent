import type { ReactNode } from 'react';
import { en } from '@/domain/copy';
import { PageSkeleton } from '@/shell';

/**
 * The fallback for every public page that has no `loading.tsx` of its own: Home, Cost Calculator,
 * Agent Strategy and Advisor. They wait for no data, so a light page outline is enough.
 */
export default function Loading(): ReactNode {
  return <PageSkeleton label={en.skeleton.page} />;
}
