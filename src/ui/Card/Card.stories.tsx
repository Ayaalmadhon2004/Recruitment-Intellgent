import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Card } from './Card';

const meta = {
  title: 'ui/Card',
  component: Card,
  args: { children: 'Card content' },
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--space-6)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Open: Story = { args: { tone: 'open' } };
export const Lift: Story = { args: { lift: true } };
export const Navy: Story = { args: { tone: 'navy', radius: 'lg' } };
export const Dashed: Story = { args: { tone: 'dashed', radius: 'lg' } };
export const Radius: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
      {(['sm', 'md', 'lg', 'xl'] as const).map((r) => (
        <Card key={r} radius={r}>
          radius {r}
        </Card>
      ))}
    </div>
  ),
};
