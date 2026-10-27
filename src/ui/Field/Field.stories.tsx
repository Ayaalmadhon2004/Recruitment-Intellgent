import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Field } from './Field';

const meta: Meta<typeof Field> = {
  title: 'ui/Field',
  component: Field,
  args: { label: 'Work email', type: 'email' },
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--space-6)', maxWidth: 480 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof Field>;

export const Default: Story = {};
export const WithHint: Story = { args: { hint: 'We email you a one-time link. No password.' } };
export const WithError: Story = {
  args: { error: 'That email does not look right. Check it and try again.', defaultValue: 'name@' },
};
export const Disabled: Story = { args: { disabled: true } };
export const Multiline: Story = {
  args: {
    label: 'Message',
    multiline: true,
    hint: 'Optional. One or two lines is plenty.',
  },
};
