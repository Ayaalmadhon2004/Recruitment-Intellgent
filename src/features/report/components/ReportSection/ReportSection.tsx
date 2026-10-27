import type { ReactNode } from 'react';
import { stagesConfig } from '@/domain/config';
import { en } from '@/domain/copy';
import { rangeLabels, stageCardLabels } from '@/features/shared-labels';
import { Button, Card } from '@/ui';
import { CtaBand, RadarChart, StageCard } from '@/patterns';
import { SectionHeader } from '@/shell';
import type { ReportMode, ReportModel } from '../../contract';
import { areaName, radarLabels } from '../../labels';
import { AdvisorSection } from '../AdvisorSection';
import { AreaExplorer } from '../AreaExplorer';
import { AreaGrid } from '../AreaGrid';
import { GaugePair } from '../GaugePair';
import { NextSteps } from '../NextSteps';
import { PilotPlan } from '../PilotPlan';
import { ReportHero } from '../ReportHero';
import type { ReportLinks } from '../types';
import { UnlockPrompt } from '../UnlockPrompt';
import styles from './ReportSection.module.css';

export type ReportSectionProps = {
  /** Computed on the server. This component only draws it. */
  model: ReportModel;
  mode: ReportMode;
  links?: ReportLinks;
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
export function ReportSection({ model, mode, links = {} }: ReportSectionProps): ReactNode {
  const radar = (
    <Card radius="lg">
      <RadarChart
        axes={model.areas.map((a) => ({ id: a.id, label: areaName(a.id), result: a.result }))}
        labels={radarLabels}
      />
    </Card>
  );

  if (mode === 'print') {
    return (
      <div className={styles.root} data-mode={mode}>
        <div className={styles.cover}>
          <ReportHero model={model} mode={mode} links={links} />
        </div>
        <div className={styles.summary}>
          <SectionHeader eyebrow={model.institutionName} title={en.report.printScoresTitle} />
          <AreaGrid areas={model.areas} mode={mode} />
          <GaugePair gauges={model.gauges} />
          <PilotPlan pilot={model.pilot} mode={mode} />
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
          <AreaGrid areas={model.areas} mode={mode} questionHref={links.questionHref} />
        </section>
        <CtaBand
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
      <ReportHero model={model} mode={mode} links={links} aside={radar} />
      <Stage model={model} eyebrow={en.report.stageEyebrow} />
      <AreaExplorer areas={model.areas} questionHref={links.questionHref} />
      <GaugePair gauges={model.gauges} questionHref={links.questionHref} />
      <NextSteps recommendations={model.recommendations} />
      <PilotPlan pilot={model.pilot} mode={mode} />
      {model.unlocked ? null : <UnlockPrompt unlockHref={links.unlockHref} />}
      <AdvisorSection />
      {links.pdfHref ? (
        <Card radius="lg" id="pdf" className={styles.pdf}>
          <div className={styles.pdfText}>
            <strong>{en.report.pdf.title}</strong>
            <span>{en.report.pdf.body}</span>
          </div>
          <Button href={links.pdfHref}>{en.report.downloadPdf}</Button>
        </Card>
      ) : null}
    </div>
  );
}
