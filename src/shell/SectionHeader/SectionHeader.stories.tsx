import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { en } from '@/domain/copy';
import { SectionHeader } from './SectionHeader';

const meta = {
  title: 'shell/SectionHeader',
  component: SectionHeader,
  args: { eyebrow: en.foundation.eyebrow, title: en.foundation.title },
} satisfies Meta<typeof SectionHeader>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop1440: Story = { globals: { viewport: { value: 'desktop', isRotated: false } } };
export const Mobile390: Story = { globals: { viewport: { value: 'mobile', isRotated: false } } };
export const PageTitle: Story = { args: { level: 'h1' } };
