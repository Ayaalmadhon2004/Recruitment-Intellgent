import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SkeletonGroup } from '@/ui';
import { ActionListSkeleton } from './ActionList';
import { QuestionCardSkeleton } from './QuestionCard';
import { RadarChartSkeleton } from './RadarChart';
import { FlowShellSkeleton } from './FlowShell';
import { ScoreCardSkeleton } from './ScoreCard';
import { ScoreRingSkeleton } from './ScoreRing';
import { StageCardSkeleton } from './StageCard';

const shapes = (container: HTMLElement): number =>
  container.querySelectorAll('span[aria-hidden="true"]').length;

describe('pattern skeletons', () => {
  it.each([
    ['ScoreCard', <ScoreCardSkeleton key="a" />, 7],
    ['ScoreRing', <ScoreRingSkeleton key="b" />, 1],
    ['RadarChart', <RadarChartSkeleton key="c" axes={6} />, 7],
    ['StageCard', <StageCardSkeleton key="d" steps={5} />, 12],
    ['QuestionCard', <QuestionCardSkeleton key="e" options={3} />, 7],
    ['ActionList', <ActionListSkeleton key="f" items={4} />, 8],
    [
      'FlowShell',
      <FlowShellSkeleton key="g" steps={5}>
        <QuestionCardSkeleton options={2} />
      </FlowShellSkeleton>,
      17,
    ],
  ])('%s renders only hidden shapes inside one busy status', (_name, ui, count) => {
    const { container } = render(<SkeletonGroup label="Loading">{ui}</SkeletonGroup>);
    expect(screen.getAllByRole('status')).toHaveLength(1);
    expect(shapes(container)).toBe(count);
    expect(container.textContent).toBe('Loading');
  });

  it('sizes the ring from its prop', () => {
    const { container } = render(
      <SkeletonGroup label="Loading">
        <ScoreRingSkeleton size={96} />
      </SkeletonGroup>,
    );
    expect(container.querySelector('span[aria-hidden="true"]')).toHaveStyle({ width: '96px' });
  });
});
