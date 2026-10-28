import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { en } from '@/domain/copy';
import { PdfExportPage } from '@/features/pdf-export';

export const metadata: Metadata = { title: en.pdfExport.meta.title };

/** Composes the feature only. */
export default function Page(): ReactNode {
  return <PdfExportPage />;
}
