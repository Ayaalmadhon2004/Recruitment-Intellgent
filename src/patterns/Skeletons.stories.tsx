import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { ReactNode } from 'react';
import { en } from '@/domain/copy';
import { SkeletonGroup } from '@/ui';
import { ActionListSkeleton } from './ActionList';
import { QuestionCardSkeleton } from './QuestionCard';
import { RadarChartSkeleton } from './RadarChart';
import { ScoreCardSkeleton } from './ScoreCard';
import { ScoreRingSkeleton } from './ScoreRing';
import { StageCardSkeleton } from './StageCard';

function Frame({ children, width = 480 }: { children: ReactNode; width?: number }): ReactNode {
  return (
    <div style={{ padding: 'var(--space-6)', maxWidth: width }}>
      <SkeletonGroup label={en.skeleton.loading}>{children}</SkeletonGroup>
    </div>
  );
}

const meta: Meta = { title: 'patterns/Skeletons' };
export default meta;
type Story = StoryObj;

export const ScoreCard: Story = {
  render: () => (
    <Frame width={360}>
      <ScoreCardSkeleton />
    </Frame>
  ),
};

export const ScoreRing: Story = {
  render: () => (
    <Frame>
      <ScoreRingSkeleton />
    </Frame>
  ),
};

export const RadarChart: Story = {
  render: () => (
    <Frame width={360}>
      <RadarChartSkeleton axes={6} />
    </Frame>
  ),
};

export const StageCard: Story = {
  render: () => (
    <Frame width={720}>
      <StageCardSkeleton steps={5} />
    </Frame>
  ),
};

export const QuestionCard: Story = {
  render: () => (
    <Frame width={720}>
      <QuestionCardSkeleton />
    </Frame>
  ),
};

export const ActionList: Story = {
  render: () => (
    <Frame width={720}>
      <ActionListSkeleton items={4} />
    </Frame>
  ),
};
