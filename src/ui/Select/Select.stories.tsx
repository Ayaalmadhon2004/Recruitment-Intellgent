import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Select } from './Select';

const options = [
  { value: 'morning', label: 'Morning, 9:00 to 12:00' },
  { value: 'afternoon', label: 'Afternoon, 13:00 to 17:00' },
  { value: 'evening', label: 'Evening, 18:00 to 20:00' },
];
const meta = {
  title: 'ui/Select',
  component: Select,
  args: { label: 'Preferred time (Vietnam time)', options },
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--space-6)', maxWidth: 480 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithPlaceholder: Story = { args: { placeholder: 'Choose one' } };
export const WithHint: Story = { args: { hint: 'We reply inside this window.' } };
export const WithError: Story = { args: { placeholder: 'Choose one', error: 'Pick a time.' } };
export const Disabled: Story = { args: { disabled: true } };
