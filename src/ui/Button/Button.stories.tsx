import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from './Button';

const meta = {
  title: 'ui/Button',
  component: Button,
  args: { children: 'Start the audit' },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Outline: Story = { args: { variant: 'outline' } };
export const Small: Story = { args: { size: 'sm' } };
export const Large: Story = { args: { size: 'lg' } };
export const Loading: Story = { args: { loading: true, loadingLabel: 'Saving' } };
export const Disabled: Story = { args: { disabled: true } };
export const AsLink: Story = { args: { href: '#' } };
export const FullWidth: Story = { args: { fullWidth: true } };
export const OnDark: Story = {
  parameters: { backgrounds: { default: 'navy' } },
  render: () => (
    <div
      style={{
        background: 'var(--color-navy)',
        padding: 'var(--space-6)',
        display: 'flex',
        gap: 'var(--space-3)',
      }}
    >
      <Button variant="inverse">Complete the audit</Button>
      <Button variant="inverse-outline">Sign in to save</Button>
    </div>
  ),
};
