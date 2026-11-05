import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { fontVariables } from '@/design';
import { en } from '@/domain/copy';
import { Providers } from './Providers';
import { getSiteUrl } from './siteUrl';
import '@/design/global.css';

/**
 * `metadataBase` is only set when `NEXT_PUBLIC_SITE_URL` is, so no address is ever invented.
 * Open Graph and Twitter carry text only: there is no approved share image yet.
 */
export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: { default: en.brand.productName, template: en.seo.titleTemplate },
  description: en.seo.siteDescription,
  applicationName: en.brand.productName,
  openGraph: {
    type: 'website',
    siteName: en.brand.productName,
    title: en.brand.productName,
    description: en.seo.siteDescription,
    locale: en.seo.locale,
  },
  twitter: {
    card: 'summary',
    title: en.brand.productName,
    description: en.seo.siteDescription,
  },
};

export default function RootLayout({ children }: { children: ReactNode }): ReactNode {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
