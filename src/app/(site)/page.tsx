import type { ReactNode } from 'react';
import { en } from '@/domain/copy';
import { PageContainer, SectionHeader, SiteFooter, SiteHeader } from '@/shell';

/** Temporary page to eyeball the shell against the design. Replaced by the landing feature. */
export default function Page(): ReactNode {
  return (
    <>
      <SiteHeader
        logoSrc="/temp-assets/logo.png"
        logoAlt={en.brand.logoAlt}
        productName={en.brand.productName}
        navLabel={en.nav.label}
        navItems={[
          { href: '#scores', label: en.nav.scores },
          { href: '#next-steps', label: en.nav.nextSteps },
          { href: '#advisor', label: en.nav.advisor },
        ]}
        cta={{ href: '#', label: en.header.cta }}
      />
      <PageContainer as="main">
        <SectionHeader eyebrow={en.foundation.eyebrow} title={en.foundation.title} />
      </PageContainer>
      <SiteFooter
        brandLine={en.brand.footerLine}
        link={{ href: en.site.url, label: en.site.host }}
      />
    </>
  );
}
