import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PageContainer } from './PageContainer';

const meta = {
  title: 'shell/PageContainer',
  component: PageContainer,
  args: { children: 'Content sits inside a 1200px container with a 48px gutter, 20px on phones.' },
} satisfies Meta<typeof PageContainer>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop1440: Story = { globals: { viewport: { value: 'desktop', isRotated: false } } };
export const Mobile390: Story = { globals: { viewport: { value: 'mobile', isRotated: false } } };
