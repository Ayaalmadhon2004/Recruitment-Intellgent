import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FreeOrFull } from './FreeOrFull';

const meta = {
  title: 'features/landing/FreeOrFull',
  component: FreeOrFull,
  args: { startHref: '/quick-start', pricing: null },
} satisfies Meta<typeof FreeOrFull>;
export default meta;
type Story = StoryObj<typeof meta>;

export const FreeDesktop1440: Story = {
  globals: { viewport: { value: 'desktop', isRotated: false } },
};
export const FreeMobile390: Story = {
  globals: { viewport: { value: 'mobile', isRotated: false } },
};
export const FullDesktop1440: Story = {
  args: { defaultMode: 'full' },
  globals: { viewport: { value: 'desktop', isRotated: false } },
};
export const FullMobile390: Story = {
  args: { defaultMode: 'full' },
  globals: { viewport: { value: 'mobile', isRotated: false } },
};
