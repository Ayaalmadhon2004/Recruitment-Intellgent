import type { ReactNode } from 'react';
import { tbcConfig } from '@/domain/config';
import { en } from '@/domain/copy';
import { reportUiCopy } from '@/design/ui-copy';
import { TbcValue } from '@/patterns';
import { SectionHeader } from '@/shell';
import { Button } from '@/ui';
import type { ReportLinks } from '../types';
import styles from './ReportClosing.module.css';

export type ReportClosingProps = {
  /** True when the full report is already open: the unlock action and its note are left out. */
  unlocked: boolean;
  links: ReportLinks;
};

const unlock = en.report.unlock;

/** One closing section: the whole plan, the agent matrix, the PDF and a person to talk to, as pill actions. */
export function ReportClosing({ unlocked, links }: ReportClosingProps): ReactNode {
  const showUnlock = !unlocked && links.unlockHref !== undefined;
  return (
    <section id="plan" className={styles.section} aria-labelledby="report-closing-title">
      <SectionHeader id="report-closing-title" eyebrow={unlock.eyebrow} title={unlock.title} />
      <p className={styles.body}>
        {unlock.body} {en.report.pdf.body}
      </p>
      <div className={styles.actions} role="group" aria-label={reportUiCopy.closing.actionsLabel}>
        {showUnlock && links.unlockHref ? (
          <Button href={links.unlockHref} size="lg">
            {unlock.cta}
          </Button>
        ) : null}
        {links.agentStrategyHref ? (
          <Button href={links.agentStrategyHref} variant="outline" size="lg">
            {reportUiCopy.closing.agentMatrix}
          </Button>
        ) : null}
        {links.pdfHref ? (
          <Button
            id="pdf"
            href={links.pdfHref}
            variant={showUnlock ? 'outline' : 'primary'}
            size="lg"
          >
            {en.report.downloadPdf}
          </Button>
        ) : null}
        {links.advisorHref ? (
          <Button href={links.advisorHref} variant="outline" size="lg">
            {en.report.advisor.title}
          </Button>
        ) : null}
      </div>
      {showUnlock ? (
        <p className={styles.note}>
          {unlock.pathLabel}:{' '}
          <TbcValue
            value={tbcConfig.unlockPaths?.map((p) => p.label).join(', ')}
            placeholder={en.status.tbc}
          />
          {'. '}
          {unlock.priceLabel}:{' '}
          <TbcValue
            value={tbcConfig.pricing}
            placeholder={en.status.tbc}
            label={en.status.pending}
          />
        </p>
      ) : null}
    </section>
  );
}
