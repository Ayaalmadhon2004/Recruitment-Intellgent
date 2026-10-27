import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ActionList } from './ActionList';

const items = [
  {
    id: 'a',
    title: 'Document your visa and offer timeline',
    effort: 'Quick win',
    body: 'Agents and families ask about this first. One clear page is enough.',
  },
  {
    id: 'b',
    title: 'Publish a scholarship guide for Vietnamese applicants',
    effort: '2-4 weeks',
    body: 'Show what is attainable, with real examples and deadlines.',
  },
  {
    id: 'c',
    title: 'Start a 6-month pilot with three agents',
    effort: '6 months',
    body: 'Non-exclusive, reviewed monthly.',
  },
];
const meta = {
  title: 'patterns/ActionList',
  component: ActionList,
  args: { items, label: 'Where to start' },
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--space-6)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ActionList>;
export default meta;
type Story = StoryObj<typeof meta>;

export const FirstOpen: Story = {};
export const Collapsed: Story = { args: { openFirst: false } };
export const SingleStep: Story = { args: { items: items.slice(0, 1) } };
