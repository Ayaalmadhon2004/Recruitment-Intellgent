import type { ReactNode } from 'react';
import { DashboardSkeleton } from '@/features/accounts';

/** Shown while the route loads, in the same frame as the page. */
export default function Loading(): ReactNode {
  return (
  <DashboardSkeleton />
  );
}
