import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { HowItWorks } from './HowItWorks';

const meta = {
  title: 'features/landing/HowItWorks',
  component: HowItWorks,
  args: {},
} satisfies Meta<typeof HowItWorks>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop1440: Story = { globals: { viewport: { value: 'desktop', isRotated: false } } };
export const Mobile390: Story = { globals: { viewport: { value: 'mobile', isRotated: false } } };
