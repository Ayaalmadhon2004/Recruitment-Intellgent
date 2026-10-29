import type { ReactNode } from 'react';
import { PdfExportLoading } from '@/features/pdf-export';

/** Shown while the PDF export route loads. */
export default function Loading(): ReactNode {
  return <PdfExportLoading />;
}
