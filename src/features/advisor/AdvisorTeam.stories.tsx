import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { AdvisorTeam } from './AdvisorTeam';

const meta = {
  title: 'features/advisor/AdvisorTeam',
  component: AdvisorTeam,
  globals: { viewport: { value: 'desktop', isRotated: false } },
} satisfies Meta<typeof AdvisorTeam>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Mobile: Story = { globals: { viewport: { value: 'mobile', isRotated: false } } };
