import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PlainSection } from './PlainSection';

const meta = {
  title: 'shell/PlainSection',
  component: PlainSection,
  args: {
    title: 'Section title',
    eyebrow: 'Eyebrow',
    children: <p>Content sits straight on the page background.</p>,
  },
} satisfies Meta<typeof PlainSection>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithLine: Story = { args: { separator: 'line' } };
export const HeadingOnly: Story = { args: { children: undefined, eyebrow: undefined } };
export const Mobile390: Story = { globals: { viewport: { value: 'mobile', isRotated: false } } };
