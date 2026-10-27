import type { ReactNode } from 'react';
import { en } from '@/domain/copy';
import { SiteFooter, SiteHeader } from '@/shell';

/** Header and footer composed once for every public page. */
export default function SiteLayout({ children }: { children: ReactNode }): ReactNode {
  return (
    <>
      <SiteHeader
        logoSrc="/temp-assets/logo.png"
        logoAlt={en.brand.logoAlt}
        productName={en.brand.productName}
        navLabel={en.nav.label}
        navItems={[]}
        cta={{ href: '/quick-start', label: en.header.cta }}
      />
      {children}
      <SiteFooter
        brandLine={en.brand.footerLine}
        link={{ href: en.site.url, label: en.site.host }}
      />
    </>
  );
}
