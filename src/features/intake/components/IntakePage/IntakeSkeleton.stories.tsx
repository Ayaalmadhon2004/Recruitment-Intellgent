import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { IntakeSkeleton } from './IntakeSkeleton';

const meta = {
  title: 'features/intake/IntakeSkeleton',
  component: IntakeSkeleton,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof IntakeSkeleton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = { globals: { viewport: { value: 'desktop', isRotated: false } } };
export const Mobile: Story = { globals: { viewport: { value: 'mobile', isRotated: false } } };
