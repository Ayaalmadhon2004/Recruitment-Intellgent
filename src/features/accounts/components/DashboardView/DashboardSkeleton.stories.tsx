import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { DashboardSkeleton } from './DashboardSkeleton';

const meta = {
  title: 'features/accounts/DashboardSkeleton',
  component: DashboardSkeleton,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof DashboardSkeleton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = { globals: { viewport: { value: 'desktop', isRotated: false } } };
export const Mobile: Story = { globals: { viewport: { value: 'mobile', isRotated: false } } };
