import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { en } from '@/domain/copy';
import { SiteFooter } from './SiteFooter';

const meta = {
  title: 'shell/SiteFooter',
  component: SiteFooter,
  args: { brandLine: en.brand.footerLine, link: { href: en.site.url, label: en.site.host } },
} satisfies Meta<typeof SiteFooter>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop1440: Story = { globals: { viewport: { value: 'desktop', isRotated: false } } };
export const Mobile390: Story = { globals: { viewport: { value: 'mobile', isRotated: false } } };
