import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from '../Button';
import { Breathe } from './Breathe';

const meta = { title: 'ui/Breathe', component: Breathe } satisfies Meta<typeof Breathe>;
export default meta;
type Story = StoryObj<typeof meta>;

export const GlowingButton: Story = {
  args: { children: <Button size="lg">Start the audit</Button> },
};
