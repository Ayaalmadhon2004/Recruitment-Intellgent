import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { fontVariables } from '@/design';
import { en } from '@/domain/copy';
import { Providers } from './Providers';
import '@/design/global.css';

export const metadata: Metadata = {
  title: { default: en.landing.meta.title, template: en.brand.titleTemplate },
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
