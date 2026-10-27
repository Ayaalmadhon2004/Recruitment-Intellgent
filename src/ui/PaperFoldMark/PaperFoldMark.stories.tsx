import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PaperFoldMark } from './PaperFoldMark';

const meta = { title: 'ui/PaperFoldMark', component: PaperFoldMark } satisfies Meta<
  typeof PaperFoldMark
>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Decorative: Story = { args: { size: 72 } };
export const Labelled: Story = { args: { size: 72, title: 'Capstone mark' } };
