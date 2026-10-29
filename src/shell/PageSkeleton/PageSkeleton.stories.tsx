import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PageSkeleton } from './PageSkeleton';

const meta = {
  title: 'shell/PageSkeleton',
  component: PageSkeleton,
  parameters: { layout: 'fullscreen' },
  args: { label: 'Loading the page' },
} satisfies Meta<typeof PageSkeleton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = { globals: { viewport: { value: 'desktop', isRotated: false } } };
export const Mobile: Story = { globals: { viewport: { value: 'mobile', isRotated: false } } };
