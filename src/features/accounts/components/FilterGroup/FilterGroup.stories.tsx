import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FilterGroup } from './FilterGroup';

const meta = {
  title: 'features/accounts/FilterGroup',
  component: FilterGroup,
  args: {
    label: 'Show',
    value: 'all',
    onChange: () => undefined,
    options: [
      { value: 'all', label: 'All', count: 3 },
      { value: 'progress', label: 'In progress', count: 2 },
      { value: 'complete', label: 'Complete', count: 1 },
    ],
  },
} satisfies Meta<typeof FilterGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const AllSelected: Story = {};
export const CompleteSelected: Story = { args: { value: 'complete' } };
