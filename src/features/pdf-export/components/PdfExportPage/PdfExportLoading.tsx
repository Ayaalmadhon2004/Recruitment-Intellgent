import type { ReactNode } from 'react';
import { PdfExportSkeleton } from './PdfExportSkeleton';

/** For the route's `loading.tsx`. The skeleton already carries the page's frame. */
export function PdfExportLoading(): ReactNode {
  return <PdfExportSkeleton />;
}
