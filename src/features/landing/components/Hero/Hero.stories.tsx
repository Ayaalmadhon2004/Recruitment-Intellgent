import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Hero } from './Hero';

const meta = {
  title: 'features/landing/Hero',
  component: Hero,
  args: { startHref: '/quick-start' },
} satisfies Meta<typeof Hero>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop1440: Story = { globals: { viewport: { value: 'desktop', isRotated: false } } };
export const Mobile390: Story = { globals: { viewport: { value: 'mobile', isRotated: false } } };
