import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SignInSkeleton } from './SignInSkeleton';

const meta = {
  title: 'features/accounts/SignInSkeleton',
  component: SignInSkeleton,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof SignInSkeleton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = { globals: { viewport: { value: 'desktop', isRotated: false } } };
export const Mobile: Story = { globals: { viewport: { value: 'mobile', isRotated: false } } };
