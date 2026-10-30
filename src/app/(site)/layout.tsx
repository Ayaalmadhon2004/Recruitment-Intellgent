import type { ReactNode } from 'react';
import { routes } from '@/domain/config';
import { en } from '@/domain/copy';
import { ScrollCompanion, SiteFooter } from '@/shell';
import { SiteHeaderWithAccount } from './SiteHeaderWithAccount';

const primaryNav = [
  { href: routes.home, label: en.nav.items.home },
  { href: routes.quickStart, label: en.nav.items.quickStart },
  { href: routes.intake, label: en.nav.items.intake },
  { href: routes.advisor, label: en.nav.items.advisor },
] as const;

const toolsNav = [
  { href: routes.report, label: en.nav.items.report },
  { href: routes.dashboard, label: en.nav.items.myAudits },
  { href: routes.costCalc, label: en.nav.items.costCalc },
  { href: routes.agentStrategy, label: en.nav.items.agentStrategy },
] as const;

const footerColumns = [
  { heading: en.footer.navigationHeading, links: primaryNav },
  { heading: en.footer.toolsHeading, links: toolsNav },
] as const;

/** Header, the single <main> landmark and footer, composed once for every public page. */
export default function SiteLayout({ children }: { children: ReactNode }): ReactNode {
  return (
    <>
      <SiteHeaderWithAccount
        homeHref={routes.home}
        logoSrc="/temp-assets/logo.png"
        logoAlt={en.brand.logoAlt}
        productName={en.brand.productName}
        navLabel={en.nav.label}
        navItems={primaryNav}
        navGroup={{ label: en.nav.toolsGroup, items: toolsNav }}
        cta={{ href: routes.quickStart, label: en.header.cta }}
        menuOpenLabel={en.header.menuOpen}
        menuCloseLabel={en.header.menuClose}
      />
      <ScrollCompanion />
      <main id="main">{children}</main>
      <SiteFooter
        homeHref={routes.home}
        logoSrc="/temp-assets/logo.png"
        logoAlt={en.brand.logoAlt}
        productName={en.brand.productName}
        tagline={en.footer.tagline}
        navLabel={en.nav.footerLabel}
        columns={footerColumns}
        external={{
          heading: en.footer.externalHeading,
          link: { href: en.site.url, label: en.site.host },
        }}
        copyright={en.footer.copyright}
      />
    </>
  );
}
