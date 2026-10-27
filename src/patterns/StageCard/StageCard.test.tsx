import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { stagesConfig } from '@/domain/config';
import { notScorable } from '@/domain/scoring';
import { rangeLabels, stageCardLabels } from '@/fixtures/labels';
import { StageCard } from './StageCard';

const stages = stagesConfig.stages;

describe('StageCard', () => {
  it('shows the headline, all four ranges and where you are', () => {
    render(
      <StageCard
        eyebrow="WHERE YOU ARE"
        result={{ kind: 'staged', stage: 'building' }}
        stages={stages}
        rangeLabels={rangeLabels}
        labels={stageCardLabels}
      />,
    );
    expect(screen.getByRole('heading', { name: 'You are building' })).toBeInTheDocument();
    for (const range of Object.values(rangeLabels))
      expect(screen.getByText(range)).toBeInTheDocument();
    expect(screen.getByText('You are here')).toBeInTheDocument();
    expect(screen.getByText('Passed')).toBeInTheDocument();
    expect(screen.getAllByText('Ahead')).toHaveLength(2);
    expect(screen.getByRole('listitem', { current: 'step' })).toHaveTextContent('6-15 students');
  });

  it('renders the not-yet-scorable state when the stage cannot be picked', () => {
    render(
      <StageCard
        eyebrow="WHERE YOU ARE"
        result={notScorable('missing-answers', ['B1'])}
        stages={stages}
        rangeLabels={rangeLabels}
        labels={stageCardLabels}
      />,
    );
    expect(screen.getByRole('heading', { name: 'Not yet scorable' })).toBeInTheDocument();
    expect(screen.queryByText('You are here')).not.toBeInTheDocument();
  });
});
