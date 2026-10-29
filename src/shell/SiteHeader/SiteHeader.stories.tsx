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
    navGroup: {
      label: en.nav.toolsGroup,
      items: [
        { href: '#report', label: en.nav.items.report },
        { href: '#cost', label: en.nav.items.costCalc },
      ],
    },
    cta: { href: '#', label: en.header.cta },
    menuOpenLabel: en.header.menuOpen,
    menuCloseLabel: en.header.menuClose,
  },
} satisfies Meta<typeof SiteHeader>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop1440: Story = { globals: { viewport: { value: 'desktop', isRotated: false } } };
export const Mobile390: Story = { globals: { viewport: { value: 'mobile', isRotated: false } } };

const account = {
  signIn: { href: '/sign-in', label: en.header.signIn },
  menuLabel: en.header.accountMenu,
  signedInAsLabel: en.header.signedInAs,
  myAudits: { href: '/dashboard', label: en.header.myAudits },
  signOutLabel: en.header.signOut,
  onSignOut: () => {},
};

export const SignedOutDesktop: Story = {
  args: { account: { ...account, user: null } },
  globals: { viewport: { value: 'desktop', isRotated: false } },
};
export const SignedInDesktop: Story = {
  args: { account: { ...account, user: { email: 'jane.doe@university.edu' } } },
  globals: { viewport: { value: 'desktop', isRotated: false } },
};
export const SignedOutMobile: Story = {
  args: { account: { ...account, user: null } },
  globals: { viewport: { value: 'mobile', isRotated: false } },
};
export const SignedInMobile: Story = {
  args: { account: { ...account, user: { email: 'jane.doe@university.edu' } } },
  globals: { viewport: { value: 'mobile', isRotated: false } },
};
