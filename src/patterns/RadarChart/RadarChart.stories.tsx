import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { notScorable, scored } from '@/domain/scoring';
import { radarLabels } from '@/fixtures/labels';
import { RadarChart } from './RadarChart';
import type { RadarAxis } from './RadarChart';

const axes: RadarAxis[] = [
  { id: 'r', label: 'Readiness', result: scored(68, 'developing', 'medium') },
  { id: 'c', label: 'Competitiveness', result: scored(54, 'needs-attention', 'low') },
  { id: 'a', label: 'Affordability', result: scored(62, 'developing', 'high') },
  { id: 'd', label: 'Digital Visibility', result: scored(78, 'strong', 'high') },
  { id: 't', label: 'Trust Network', result: scored(49, 'needs-attention', 'low') },
];
const meta = {
  title: 'patterns/RadarChart',
  component: RadarChart,
  args: { axes, labels: radarLabels },
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--space-6)', maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RadarChart>;
export default meta;
type Story = StoryObj<typeof meta>;

export const FiveAreas: Story = {};
export const WithNotScorableArea: Story = {
  args: {
    axes: [
      ...axes,
      { id: 'i', label: 'Community Influence', result: notScorable('missing-answers', ['E1']) },
    ],
  },
};
export const MostlyNotScorable: Story = {
  args: { axes: axes.map((a, i) => (i < 2 ? a : { ...a, result: notScorable('no-formula', []) })) },
};
