import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ScrollCompanion } from './ScrollCompanion';

const meta = {
  title: 'shell/ScrollCompanion',
  component: ScrollCompanion,
  decorators: [
    (Story) => (
      <div style={{ height: '300vh', padding: 'var(--space-6)' }}>
        <p>Scroll the page: the kite follows along the dashed path.</p>
        {Story()}
      </div>
    ),
  ],
} satisfies Meta<typeof ScrollCompanion>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop1440: Story = { globals: { viewport: { value: 'desktop', isRotated: false } } };
export const Mobile390: Story = { globals: { viewport: { value: 'mobile', isRotated: false } } };
