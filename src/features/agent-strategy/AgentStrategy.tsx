'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import { agentsConfig, tbcConfig } from '@/domain/config';
import { en } from '@/domain/copy';
import type { AgentFactorId, AgentsConfig } from '@/domain/types';
import { AdvisorCta, SampleDataBadge } from '@/patterns';
import { PageContainer, SectionHeader, WaveDivider } from '@/shell';
import { AgentMatrix } from './AgentMatrix';
import { FactorDonut } from './FactorDonut';
import { ForecastSection } from './ForecastSection';
import { PilotTimeline } from './PilotTimeline';
import { fill } from './format';
import type { ForecastFormValues, SampleAgent } from './types';
import styles from './AgentStrategy.module.css';

const copy = en.agentStrategy;

export type AgentStrategyProps = {
  /** Factors, weights, pilot terms and rating range. Defaults to the app config. */
  config?: AgentsConfig;
  /** Sample agents and ratings. Not real. */
  agents: readonly SampleAgent[];
  /** Sample forecast inputs, as typed. Not a prediction. */
  initialForecast: ForecastFormValues;
  initialFactorId?: AgentFactorId | null;
  initialAgentId?: string;
  /** 1-based. */
  initialMonth?: number;
};

export function AgentStrategy({
  config = agentsConfig,
  agents,
  initialForecast,
  initialFactorId = null,
  initialAgentId,
  initialMonth = 1,
}: AgentStrategyProps): ReactNode {
  const [factorId, setFactorId] = useState<AgentFactorId | null>(initialFactorId);
  const [agentId, setAgentId] = useState<string>(initialAgentId ?? agents[0]?.id ?? '');
  const [month, setMonth] = useState<number>(initialMonth);
  const [forecastValues, setForecastValues] = useState<ForecastFormValues>(initialForecast);

  const { pilot, factors, rating } = config;
  const vars = {
    months: pilot.durationMonths,
    agentCount: pilot.agentCount,
    min: pilot.commissionBenchmarkPercent.min,
    max: pilot.commissionBenchmarkPercent.max,
  };
  const chips = [
    fill(copy.hero.pilotMonths, vars),
    fill(copy.hero.pilotAgents, vars),
    pilot.exclusive ? copy.hero.exclusive : copy.hero.nonExclusive,
    fill(copy.hero.commission, vars),
  ];
  const weightsAreSample = config.factorsStatus !== 'confirmed';

  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="as-hero">
        <PageContainer className={styles.heroInner}>
          <SampleDataBadge label={en.status.sample} />
          <h1 id="as-hero" className={styles.heroTitle}>
            {copy.hero.title}
          </h1>
          <p className={styles.heroLead}>{fill(copy.hero.lead, vars)}</p>
          <ul className={styles.chips} aria-label={copy.hero.chipsLabel}>
            {chips.map((chip) => (
              <li key={chip} className={styles.pill}>
                {chip}
              </li>
            ))}
          </ul>
        </PageContainer>
      </section>
      <WaveDivider from="navy" to="page" />

      <PageContainer className={styles.main}>
        <section aria-labelledby="as-weights" className={styles.section}>
          <div className={styles.sectionHead}>
            <SectionHeader
              id="as-weights"
              eyebrow={copy.weights.eyebrow}
              title={fill(copy.weights.title, { count: factors.length })}
            />
            {weightsAreSample ? (
              <SampleDataBadge variant="outline" label={copy.weights.sampleWeights} />
            ) : null}
          </div>
          <FactorDonut factors={factors} selectedId={factorId} onSelect={setFactorId} />
        </section>

        <section aria-labelledby="as-matrix" className={styles.section}>
          <div className={styles.sectionHead}>
            <SectionHeader
              id="as-matrix"
              eyebrow={copy.matrix.eyebrow}
              title={fill(copy.matrix.title, rating)}
            />
          </div>
          <AgentMatrix
            factors={factors}
            rating={rating}
            agents={agents}
            selectedId={agentId}
            onSelect={setAgentId}
          />
        </section>

        <section aria-labelledby="as-pilot" className={styles.section}>
          <SectionHeader
            id="as-pilot"
            eyebrow={copy.pilot.eyebrow}
            title={fill(copy.pilot.title, vars)}
          />
          <PilotTimeline pilot={pilot} month={month} onSelect={setMonth} />
        </section>
      </PageContainer>

      {/* A full-width tinted band of its own, so the forecast reads as a separate tool from the pilot above. */}
      <section id="forecast" aria-labelledby="as-forecast" className={styles.forecastBand}>
        <PageContainer className={styles.forecastInner}>
          <SectionHeader
            id="as-forecast"
            eyebrow={copy.forecast.eyebrow}
            title={copy.forecast.title}
          />
          <ForecastSection values={forecastValues} onChange={setForecastValues} />
        </PageContainer>
      </section>

      <PageContainer className={styles.closing}>
        <AdvisorCta
          title={copy.cta.title}
          body={fill(copy.cta.body, vars)}
          photo={{ placeholder: copy.cta.photoPlaceholder }}
          tbcText={en.status.tbc}
          pendingText={en.status.pending}
          channels={[
            { id: 'whatsapp', label: copy.cta.channels.whatsapp, href: tbcConfig.advisorWhatsapp },
            { id: 'email', label: copy.cta.channels.email, href: tbcConfig.advisorEmail },
            { id: 'call', label: copy.cta.channels.call, href: tbcConfig.advisorCallDetails },
          ]}
        />
      </PageContainer>
    </div>
  );
}
