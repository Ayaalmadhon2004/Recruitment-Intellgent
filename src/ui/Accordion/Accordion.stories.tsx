import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Accordion } from './Accordion';

const items = [
  {
    id: 'a',
    title: 'Document your visa and offer timeline',
    subtitle: 'Quick win',
    content: 'Agents and families ask about this first. One clear page is enough.',
  },
  {
    id: 'b',
    title: 'Publish a scholarship guide for Vietnamese applicants',
    subtitle: '2-4 weeks',
    content: 'Show what is attainable, with real examples and deadlines.',
  },
  {
    id: 'c',
    title: 'Start a 6-month pilot with three agents',
    subtitle: '6 months',
    content: 'Non-exclusive, reviewed monthly.',
  },
];
const meta = {
  title: 'ui/Accordion',
  component: Accordion,
  args: { items },
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--space-6)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Accordion>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Collapsed: Story = {};
export const FirstOpen: Story = { args: { defaultOpenIds: ['a'] } };
export const Multiple: Story = { args: { multiple: true, defaultOpenIds: ['a', 'b'] } };
