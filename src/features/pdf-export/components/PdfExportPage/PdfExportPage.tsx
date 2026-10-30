'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { tbcConfig } from '@/domain/config';
import { en, fill } from '@/domain/copy';
import type { Audit } from '@/domain/types';
import {
  ReportSection,
  ReportStateMessage,
  defaultPrintSections,
  useFocusHeading,
  useReportState,
} from '@/features/report';
import type { PrintSectionId, ReportModel } from '@/features/report';
import { SampleDataBadge, TbcValue } from '@/patterns';
import { Button, cx } from '@/ui';
import { PagePreview } from '../PagePreview';
import type { PreviewPage } from '../PagePreview';
import { PdfOptions } from '../PdfOptions';
import { PdfExportSkeleton } from './PdfExportSkeleton';
import styles from './PdfExportPage.module.css';

export type PdfExportPageProps = {
  reportHref?: string;
  quickStartHref?: string;
  intakeHref?: string;
  /** Opens the browser's print window. Replaced in tests. */
  onPrint?: () => void;
  /** Replaces the stored audit. For tests and stories. Keep the reference stable. */
  loadAudit?: () => Audit | null;
  /** Fixed state for stories. Skips storage and the network. */
  previewState?: 'loading' | 'error' | 'empty';
  /** A ready report for stories. Skips storage and the network. */
  previewModel?: ReportModel;
};

const copy = en.pdfExport;
const pageNames = { cover: copy.pages.cover, content: copy.pages.content } as const;
const pageIds = ['cover', 'content'] as const satisfies readonly PreviewPage[];

const printWindow = (): void => window.print();

/** The PDF page: pick the sections, see the A4 pages, then print or save as PDF from the browser. */
export function PdfExportPage({
  reportHref = '/report',
  quickStartHref = '/quick-start',
  intakeHref = '/intake',
  onPrint = printWindow,
  loadAudit,
  previewState,
  previewModel,
}: PdfExportPageProps): ReactNode {
  const preview = previewState !== undefined || previewModel !== undefined;
  const state = useReportState({ loadAudit, previewState, previewModel });
  const root = useFocusHeading(state.status, state.status !== 'loading' || preview);
  const [sections, setSections] = useState<readonly PrintSectionId[]>(defaultPrintSections);
  const [logoOn, setLogoOn] = useState(false);
  const [page, setPage] = useState<PreviewPage>('cover');

  if (state.status === 'loading') return <PdfExportSkeleton />;

  if (state.status !== 'ready') {
    return (
      <div ref={root} className={styles.root}>
        <ReportStateMessage
          state={state.status}
          onRetry={state.retry}
          quickStartHref={quickStartHref}
          intakeHref={intakeHref}
        />
      </div>
    );
  }

  const { model } = state;
  const setSection = (id: PrintSectionId, on: boolean): void =>
    setSections((current) => (on ? [...current, id] : current.filter((s) => s !== id)));

  const brand = (
    <div className={styles.brand}>
      <Image
        src="/temp-assets/logo.png"
        alt={en.brand.logoAlt}
        width={611}
        height={139}
        className={styles.logo}
      />
      {logoOn ? (
        <span className={styles.logoBox}>
          <TbcValue
            value={tbcConfig.pdfInstitutionLogoUpload}
            placeholder={copy.preview.logoPlaceholder}
            label={en.status.pending}
          />
        </span>
      ) : null}
    </div>
  );

  const ariaLabel = fill(model.isSample ? copy.preview.ariaSample : copy.preview.aria, {
    name: model.institutionName,
  });
  const caption = `${page === 'cover' ? copy.preview.captionCover : copy.preview.captionContent}${
    model.isSample ? ` ${en.status.sample}` : ''
  }`;

  return (
    <div ref={root} className={styles.root}>
      <section className={styles.intro}>
        {model.isSample ? <SampleDataBadge label={en.status.sample} /> : null}
        <span className={styles.eyebrow}>{copy.hero.eyebrow}</span>
        <h1 className={styles.title}>{copy.hero.title}</h1>
        <p className={styles.lead}>{copy.hero.lead}</p>
        <div>
          <Button href={reportHref} variant="secondary">
            {copy.nav.backToReport}
          </Button>
        </div>
      </section>

      <section className={styles.workspace}>
        <div className={styles.canvas}>
          <div role="group" aria-label={copy.pages.label} className={styles.pages}>
            {pageIds.map((id) => (
              <button
                key={id}
                type="button"
                aria-pressed={page === id}
                className={cx(styles.pageButton, page === id && styles.pageOn)}
                onClick={() => setPage(id)}
              >
                {pageNames[id]}
              </button>
            ))}
          </div>
          <PagePreview
            page={page}
            ariaLabel={ariaLabel}
            watermark={model.isSample ? copy.preview.sampleMark : undefined}
            footer={
              model.isSample ? (
                <>
                  <span>{en.status.sample}</span>
                  <span>{en.site.host}</span>
                </>
              ) : (
                <span>{en.site.host}</span>
              )
            }
          >
            <ReportSection model={model} mode="print" print={{ sections, brand }} />
          </PagePreview>
          <p aria-live="polite" className={styles.caption}>
            {caption}
          </p>
        </div>

        <PdfOptions
          sections={sections}
          onSectionChange={setSection}
          logoOn={logoOn}
          onLogoChange={setLogoOn}
          onDownload={onPrint}
        />
      </section>
    </div>
  );
}
