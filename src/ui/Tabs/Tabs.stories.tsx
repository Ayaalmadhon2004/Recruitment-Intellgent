import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Tabs } from './Tabs';

const tabs = [
  { id: 'readiness', label: 'Readiness', badge: '68', content: <p>Readiness panel content.</p> },
  {
    id: 'competitiveness',
    label: 'Competitiveness',
    badge: '54',
    content: <p>Competitiveness panel content.</p>,
  },
  {
    id: 'community',
    label: 'Community Influence',
    badge: 'n/a',
    content: <p>Not yet scorable.</p>,
  },
];
const meta = {
  title: 'ui/Tabs',
  component: Tabs,
  args: { tabs, label: 'Score areas' },
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--space-6)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tabs>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {};
export const Vertical: Story = { args: { orientation: 'vertical' } };
export const SecondSelected: Story = { args: { defaultTabId: 'competitiveness' } };
