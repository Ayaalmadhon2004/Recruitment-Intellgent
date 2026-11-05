'use client';

import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { PaperPlaneProvider, ToastProvider } from '@/ui';

/** Client-side providers for the whole app: toasts, and the paper plane that carries a button press to the next page. */
export function Providers({ children }: { children: ReactNode }): ReactNode {
  const router = useRouter();
  return (
    <PaperPlaneProvider navigate={(href) => router.push(href)}>
      <ToastProvider>{children}</ToastProvider>
    </PaperPlaneProvider>
  );
}
