import type { ReactNode } from 'react';
import { UnlockPageLoading } from '@/features/unlock';

/** Shown while the route loads, in the same frame as the page. */
export default function Loading(): ReactNode {
  return (
  <UnlockPageLoading />
  );
}
