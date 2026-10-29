import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { UnlockPageLoading } from './UnlockPageLoading';

const meta = {
  title: 'features/unlock/UnlockPageLoading',
  component: UnlockPageLoading,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof UnlockPageLoading>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = { globals: { viewport: { value: 'desktop', isRotated: false } } };
export const Mobile: Story = { globals: { viewport: { value: 'mobile', isRotated: false } } };
