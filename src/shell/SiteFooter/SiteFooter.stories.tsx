import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { routes } from '@/domain/config';
import { en } from '@/domain/copy';
import { SiteFooter } from './SiteFooter';

const meta = {
  title: 'shell/SiteFooter',
  component: SiteFooter,
  args: {
    homeHref: routes.home,
    logoSrc: '/temp-assets/logo.png',
    logoAlt: en.brand.logoAlt,
    productName: en.brand.productName,
    tagline: en.footer.tagline,
    navLabel: en.nav.footerLabel,
    columns: [
      {
        heading: en.footer.navigationHeading,
        links: [
          { href: routes.home, label: en.nav.items.home },
          { href: routes.quickStart, label: en.nav.items.quickStart },
          { href: routes.intake, label: en.nav.items.intake },
          { href: routes.report, label: en.nav.items.report },
          { href: routes.dashboard, label: en.nav.items.myAudits },
        ],
      },
      {
        heading: en.footer.toolsHeading,
        links: [
          { href: routes.costCalc, label: en.nav.items.costCalc },
          { href: routes.agentStrategy, label: en.nav.items.agentStrategy },
          { href: routes.advisor, label: en.nav.items.advisor },
        ],
      },
    ],
    external: {
      heading: en.footer.externalHeading,
      link: { href: en.site.url, label: en.site.host },
    },
    copyright: en.footer.copyright,
  },
} satisfies Meta<typeof SiteFooter>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop1440: Story = { globals: { viewport: { value: 'desktop', isRotated: false } } };
export const Mobile390: Story = { globals: { viewport: { value: 'mobile', isRotated: false } } };
export const WithLegalLinks: Story = {
  args: { legalLabel: 'Legal', legalLinks: [{ href: '/privacy', label: 'Privacy' }] },
};
