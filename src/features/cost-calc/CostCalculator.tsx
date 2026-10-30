'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import { scoringConfig, routes } from '@/domain/config';
import { en, t } from '@/domain/copy';
import {
  appliedScholarship,
  fourYearCost,
  netAnnualCost,
  priceBandFor,
  scholarshipCoverage,
} from '@/domain/scoring';
import type { ScoringConfig } from '@/domain/types';
import { CtaBand, SampleDataBadge, TbcValue } from '@/patterns';
import { PageContainer, SectionHeader } from '@/shell';
import { Field, RangeSlider, Switch } from '@/ui';
import { AffordabilityWeights } from './components/AffordabilityWeights';
import { PeerChart, PeerSampleBadge } from './components/PeerChart';
import type { PeerRow } from './components/PeerChart';
import { PriceBandLine } from './components/PriceBandLine';
import { ResultCard } from './components/ResultCard';
import { fill, parseAmount, scholarshipMax, sliderStep, usd } from './format';
import styles from './CostCalculator.module.css';

export type CostInputs = {
  tuition: string;
  living: string;
  scholarship: number;
  includeLiving: boolean;
};

export type CostCalculatorProps = {
  /** Starting values. Without them every field starts empty. */
  initial?: Partial<CostInputs>;
  /** Sample peers. When given, the sample badge and note are shown. Never real institutions. */
  peers?: readonly PeerRow[];
  /** Where "Open score detail" goes. */
  detailHref?: string;
  /** Where "Back to report" goes. */
  reportHref?: string;
  /** Price bands and Affordability weights. Defaults to the shared config. */
  config?: Pick<ScoringConfig, 'priceBands' | 'affordabilityWeights'>;
};

const emptyInputs: CostInputs = { tuition: '', living: '', scholarship: 0, includeLiving: true };

export function CostCalculator({
  initial,
  peers = [],
  detailHref = routes.reportArea('affordability'),
  reportHref = routes.report,
  config = scoringConfig,
}: CostCalculatorProps): ReactNode {
  const [inputs, setInputs] = useState<CostInputs>({ ...emptyInputs, ...initial });
  const c = en.costCalc;

  const tuitionParsed = parseAmount(inputs.tuition);
  const livingParsed = parseAmount(inputs.living);
  const tuition = tuitionParsed.value;
  const living = livingParsed.value;
  const sliderMax = scholarshipMax(tuition);
  const scholarship = Math.min(inputs.scholarship, sliderMax);

  const applied = appliedScholarship(tuition, scholarship);
  const net = netAnnualCost({
    tuition,
    living,
    includeLiving: inputs.includeLiving,
    scholarship,
  });
  const coverage = scholarshipCoverage(tuition, scholarship);
  const bandId = priceBandFor(net, config.priceBands);
  const band = config.priceBands.find((b) => b.id === bandId);
  const topBandStart = Math.max(...config.priceBands.map((b) => b.minUsd));
  const isSample = peers.length > 0;

  const set = (patch: Partial<CostInputs>): void => setInputs((prev) => ({ ...prev, ...patch }));

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <PageContainer className={styles.heroInner}>
          <nav aria-label={c.hero.breadcrumbLabel}>
            <ol className={styles.crumbs}>
              <li>
                <a href={reportHref} className={styles.crumbLink}>
                  {c.hero.parent}
                </a>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className={styles.crumbCurrent}>
                {c.hero.current}
              </li>
            </ol>
          </nav>
          <div className={styles.heroText}>
            {isSample ? <SampleDataBadge label={en.status.sample} /> : null}
            <h1 className={styles.title}>{c.hero.title}</h1>
            <p className={styles.lead}>{c.hero.lead}</p>
          </div>
        </PageContainer>
      </section>

      <PageContainer className={styles.content}>
        <section aria-labelledby="cc-inputs" className={styles.section}>
          <SectionHeader eyebrow={c.inputs.eyebrow} title={c.inputs.title} id="cc-inputs" />
          <div className={styles.split}>
            <section className={styles.form} aria-label={c.inputs.title}>
              <Field
                label={c.inputs.tuition}
                type="number"
                inputMode="numeric"
                min={0}
                step={sliderStep}
                value={inputs.tuition}
                error={tuitionParsed.invalid ? c.inputs.amountError : undefined}
                onChange={(e) => set({ tuition: e.currentTarget.value })}
              />
              <Field
                label={c.inputs.living}
                type="number"
                inputMode="numeric"
                min={0}
                step={sliderStep}
                value={inputs.living}
                error={livingParsed.invalid ? c.inputs.amountError : undefined}
                onChange={(e) => set({ living: e.currentTarget.value })}
              />
              <Switch
                label={c.inputs.includeLiving}
                checked={inputs.includeLiving}
                onChange={(includeLiving) => set({ includeLiving })}
                onLabel={c.inputs.on}
                offLabel={c.inputs.off}
              />
              <RangeSlider
                label={c.inputs.scholarship}
                min={0}
                max={sliderMax}
                step={sliderStep}
                value={scholarship}
                onChange={(value) => set({ scholarship: value })}
                formatValue={usd}
                minLabel={c.inputs.scholarshipMin}
                maxLabel={fill(c.inputs.scholarshipMax, { amount: usd(sliderMax) })}
              />
              <div className={styles.vnd}>
                <span id="cc-vnd-label" className={styles.vndLabel}>
                  {c.inputs.vnd}
                </span>
                <div className={styles.vndBox} role="group" aria-labelledby="cc-vnd-label">
                  {/* No confirmed rate (tbc.config vndExchangeRate is null): no conversion is made. */}
                  <TbcValue value={null} placeholder={en.status.tbc} label={en.status.pending} />
                </div>
                <span className={styles.vndNote}>{c.inputs.vndNote}</span>
              </div>
            </section>
            <ResultCard
              tuition={tuition}
              living={living}
              includeLiving={inputs.includeLiving}
              appliedScholarship={applied}
              net={net}
              coveragePercent={coverage}
              bandLabel={band ? t(band.labelKey) : ''}
              fourYears={fourYearCost(net)}
            />
          </div>
        </section>

        <section aria-labelledby="cc-band" className={styles.section}>
          <SectionHeader eyebrow={c.bands.eyebrow} title={c.bands.title} id="cc-band" />
          <PriceBandLine bands={config.priceBands} current={bandId} net={net} />
        </section>

        {isSample ? (
          <section aria-labelledby="cc-peers" className={styles.section}>
            <div className={styles.peersHead}>
              <SectionHeader eyebrow={c.peers.eyebrow} title={c.peers.title} id="cc-peers" />
              <PeerSampleBadge />
            </div>
            <PeerChart youNetUsd={net} peers={peers} scaleMinUsd={topBandStart} />
          </section>
        ) : null}

        <section aria-labelledby="cc-weights" className={styles.section}>
          <SectionHeader eyebrow={c.weights.eyebrow} title={c.weights.title} id="cc-weights" />
          <AffordabilityWeights weights={config.affordabilityWeights} />
        </section>

        <CtaBand
          tone="panel"
          title={c.cta.title}
          body={c.cta.body}
          actions={[
            { label: c.cta.detail, href: detailHref },
            { label: c.cta.back, href: reportHref, variant: 'inverse-outline' },
          ]}
        />
      </PageContainer>
    </div>
  );
}
