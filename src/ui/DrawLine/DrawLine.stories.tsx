import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { ReactElement } from 'react';
import { DrawLine } from './DrawLine';

const meta = { title: 'ui/DrawLine', component: DrawLine } satisfies Meta<typeof DrawLine>;
export default meta;
type Story = StoryObj<typeof meta>;

const frame = (child: ReactElement): ReactElement => (
  <svg width="320" height="60" role="img" aria-label="Line">
    <style>
      {'.dl{stroke:var(--color-navy);stroke-width:3;stroke-dasharray:2 8;stroke-linecap:round}'}
    </style>
    {child}
  </svg>
);

export const Draws: Story = {
  args: { d: 'M10 30 H310' },
  render: (args) => frame(<DrawLine {...args} className="dl" />),
};
export const Controlled: Story = {
  args: { d: 'M10 30 H310', progress: 0.5 },
  render: (args) => frame(<DrawLine {...args} className="dl" />),
};
