import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { sampleAgentStrategy } from '@/fixtures/agentStrategy';
import { en } from '@/domain/copy';
import { AgentStrategy } from '@/features/agent-strategy';

export const metadata: Metadata = {
  title: en.agentStrategy.meta.title,
  description: en.agentStrategy.meta.description,
};

/** Composes the feature only. The agents, ratings and forecast inputs are labelled sample data. */
export default function Page(): ReactNode {
  return (
    <AgentStrategy
      agents={sampleAgentStrategy.agents}
      initialForecast={sampleAgentStrategy.forecastValues}
    />
  );
}
