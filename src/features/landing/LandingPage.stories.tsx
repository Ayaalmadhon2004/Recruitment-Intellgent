import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { LandingPage } from './LandingPage';

const meta = {
  title: 'features/landing/LandingPage',
  component: LandingPage,
  args: {},
} satisfies Meta<typeof LandingPage>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop1440: Story = { globals: { viewport: { value: 'desktop', isRotated: false } } };
export const Mobile390: Story = { globals: { viewport: { value: 'mobile', isRotated: false } } };
