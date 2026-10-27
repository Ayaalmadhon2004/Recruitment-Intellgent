import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { poppins } from '@/design';
import { en } from '@/domain/copy';
import '@/design/global.css';

export const metadata: Metadata = {
  title: en.brand.productName,
};

export default function RootLayout({ children }: { children: ReactNode }): ReactNode {
  return (
    <html lang="en" className={poppins.variable}>
      <body>{children}</body>
    </html>
  );
}
