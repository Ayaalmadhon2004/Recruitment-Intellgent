import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { WhatYouGet } from './WhatYouGet';

const meta = {
  title: 'features/landing/WhatYouGet',
  component: WhatYouGet,
  args: {},
} satisfies Meta<typeof WhatYouGet>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop1440: Story = { globals: { viewport: { value: 'desktop', isRotated: false } } };
export const Mobile390: Story = { globals: { viewport: { value: 'mobile', isRotated: false } } };
