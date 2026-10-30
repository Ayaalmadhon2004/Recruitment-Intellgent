import type { ReactNode } from 'react';
import { stagesConfig } from '@/domain/config';
import { en } from '@/domain/copy';
import { rangeLabels, stageCardLabels } from '@/features/shared-labels';
import type { Answer } from '@/domain/types';
import { CtaBand, StageCard } from '@/patterns';
import { SectionHeader } from '@/shell';
import { isOpenArea } from '../../contract';
import type { ReportMode, ReportModel } from '../../contract';
import { defaultPrintSections } from '../../printOptions';
import type { PrintOptions } from '../../printOptions';
import { AreaGrid } from '../AreaGrid';
import { GaugePair } from '../GaugePair';
import { NextSteps } from '../NextSteps';
import { PilotPlan } from '../PilotPlan';
import { ReportBanner } from '../ReportBanner';
import { ReportClosing } from '../ReportClosing';
import { ScoreMetrics } from '../ScoreMetrics';
import { PrintAffordability } from '../PrintAffordability';
import { PrintEvidence } from '../PrintEvidence';
import { ReportHero } from '../ReportHero';
import type { ReportLinks } from '../types';
import styles from './ReportSection.module.css';

export type ReportSectionProps = {
  /** Computed on the server. This component only draws it. */
  model: ReportModel;
  mode: ReportMode;
  links?: ReportLinks;
  /** Print mode only: which parts to print and the brand bar. Ignored in the other modes. */
  print?: PrintOptions;
  /** Interactive mode only: the stored answers, so each question fills its cell in the banner's kite. */
  answers?: readonly Answer[];
};

/** The stage block, shared by the interactive report and the free preview. */
function Stage({ model, eyebrow }: { model: ReportModel; eyebrow: string }): ReactNode {
  return (
    <StageCard
      result={model.stage}
      stages={stagesConfig.stages}
      rangeLabels={rangeLabels}
      labels={stageCardLabels}
      eyebrow={eyebrow}
    />
  );
}

/** One report, three modes: interactive (tabs, carousel), preview (free first read) and print (static). */
export function ReportSection({
  model,
  mode,
  links = {},
  print = {},
  answers,
}: ReportSectionProps): ReactNode {
  const openAreas = model.areas.filter(isOpenArea);

  if (mode === 'print') {
    const { sections = defaultPrintSections, brand } = print;
    const on = (id: (typeof sections)[number]): boolean => sections.includes(id);
    return (
      <div className={styles.root} data-mode={mode}>
        <div className={styles.cover} data-part="cover">
          {brand}
          <ReportHero model={model} mode={mode} links={links} />
        </div>
        <div className={styles.summary} data-part="content">
          {on('scores') ? (
            <>
              <SectionHeader eyebrow={model.institutionName} title={en.report.printScoresTitle} />
              <AreaGrid areas={model.areas} mode={mode} />
              <GaugePair gauges={model.gauges} />
            </>
          ) : null}
          {on('steps') ? <NextSteps recommendations={model.recommendations} mode={mode} /> : null}
          {on('afford') ? <PrintAffordability /> : null}
          {on('pilot') ? <PilotPlan pilot={model.pilot} mode={mode} /> : null}
          {on('evidence') ? <PrintEvidence areas={openAreas} /> : null}
          {sections.length === 0 ? (
            <p className={styles.none}>{en.report.print.noSections}</p>
          ) : null}
        </div>
      </div>
    );
  }

  if (mode === 'preview') {
    const actions = [
      links.continueHref ? { label: en.firstRead.ctaContinue, href: links.continueHref } : null,
      links.unlockHref && !model.unlocked
        ? { label: en.report.unlock.cta, href: links.unlockHref }
        : null,
      links.changeAnswersHref
        ? {
            label: en.firstRead.ctaChange,
            href: links.changeAnswersHref,
            variant: 'inverse-outline' as const,
          }
        : null,
    ].flatMap((action) => (action ? [action] : []));
    return (
      <div className={styles.root} data-mode={mode}>
        <ReportHero model={model} mode={mode} links={links} />
        <Stage model={model} eyebrow={en.firstRead.stageEyebrow} />
        <section className={styles.group} aria-labelledby="report-areas-title">
          <SectionHeader
            id="report-areas-title"
            eyebrow={en.report.previewScoresEyebrow}
            title={en.report.previewScoresTitle}
          />
          <AreaGrid
            areas={model.areas}
            mode={mode}
            questionHref={links.questionHref}
            unlockHref={links.unlockHref}
          />
        </section>
        <CtaBand
          tone="panel"
          eyebrow={en.firstRead.ctaEyebrow}
          title={en.firstRead.ctaTitle}
          body={en.firstRead.ctaBody}
          actions={actions}
        />
      </div>
    );
  }

  return (
    <div className={styles.root} data-mode={mode}>
      <ReportBanner model={model} links={links} answers={answers} />
      <ScoreMetrics model={model} questionHref={links.questionHref} unlockHref={links.unlockHref} />
      <GaugePair gauges={model.gauges} questionHref={links.questionHref} />
      <NextSteps recommendations={model.recommendations} />
      <ReportClosing unlocked={model.unlocked} links={links} />
    </div>
  );
}
