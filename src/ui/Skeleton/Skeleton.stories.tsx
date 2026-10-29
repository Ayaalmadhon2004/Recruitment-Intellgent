import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { en } from '@/domain/copy';
import { Skeleton, SkeletonGroup } from './Skeleton';

const meta: Meta<typeof SkeletonGroup> = { title: 'ui/Skeleton', component: SkeletonGroup };
export default meta;
type Story = StoryObj<typeof SkeletonGroup>;

const frame = { padding: 'var(--space-6)', maxWidth: 480 } as const;

export const Shapes: Story = {
  render: () => (
    <div style={frame}>
      <SkeletonGroup label={en.skeleton.loading}>
        <Skeleton shape="line" width="60%" />
        <Skeleton shape="line" />
        <Skeleton shape="line" width="80%" />
        <Skeleton shape="circle" width="var(--space-10)" />
        <Skeleton shape="pill" width="160px" />
        <Skeleton shape="block" height="160px" />
      </SkeletonGroup>
    </div>
  ),
};

export const CardLike: Story = {
  render: () => (
    <div style={frame}>
      <SkeletonGroup label={en.skeleton.loading}>
        <Skeleton shape="block" aspectRatio="16 / 9" />
        <Skeleton shape="line" width="40%" />
        <Skeleton shape="line" />
        <Skeleton shape="line" width="70%" />
      </SkeletonGroup>
    </div>
  ),
};
