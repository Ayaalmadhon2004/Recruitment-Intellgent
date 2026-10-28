import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { en } from '@/domain/copy';
import { SiteHeader } from './SiteHeader';

const meta = {
  title: 'shell/SiteHeader',
  component: SiteHeader,
  args: {
    homeHref: '/',
    logoSrc: '/temp-assets/logo.png',
    logoAlt: en.brand.logoAlt,
    productName: en.brand.productName,
    navLabel: en.nav.label,
    navItems: [
      { href: '#scores', label: en.nav.scores },
      { href: '#next-steps', label: en.nav.nextSteps },
      { href: '#advisor', label: en.nav.advisor },
    ],
    cta: { href: '#', label: en.header.cta },
    menuOpenLabel: en.header.menuOpen,
    menuCloseLabel: en.header.menuClose,
  },
} satisfies Meta<typeof SiteHeader>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop1440: Story = { globals: { viewport: { value: 'desktop', isRotated: false } } };
export const Mobile390: Story = { globals: { viewport: { value: 'mobile', isRotated: false } } };
