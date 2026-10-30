import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { fontVariables } from '@/design';
import { en } from '@/domain/copy';
import { ToastProvider } from '@/ui';
import '@/design/global.css';

export const metadata: Metadata = {
  title: en.brand.productName,
};

export default function RootLayout({ children }: { children: ReactNode }): ReactNode {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
