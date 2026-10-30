import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FinalCta } from './FinalCta';

const meta = {
  title: 'features/landing/FinalCta',
  component: FinalCta,
  args: { startHref: '/quick-start' },
} satisfies Meta<typeof FinalCta>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop1440: Story = { globals: { viewport: { value: 'desktop', isRotated: false } } };
export const Mobile390: Story = { globals: { viewport: { value: 'mobile', isRotated: false } } };
