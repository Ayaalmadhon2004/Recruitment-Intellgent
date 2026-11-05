'use client';

import type { ReactNode } from 'react';
import { fontVariables } from '@/design';
import { routes } from '@/domain/config';
import { en } from '@/domain/copy';
import { ErrorState } from '@/shell';
import { Button } from '@/ui';
import '@/design/global.css';

/** Replaces the root layout when it fails, so it brings its own <html> and <body>. */
export default function GlobalError({ reset }: { error: Error; reset: () => void }): ReactNode {
  return (
    <html lang="en" className={fontVariables}>
      <head>
        <title>{en.errorPages.globalError.documentTitle}</title>
      </head>
      <body>
        <ErrorState
          as="main"
          eyebrow={en.errorPages.globalError.eyebrow}
          title={en.errorPages.globalError.title}
          body={en.errorPages.globalError.body}
        >
          <Button onClick={reset}>{en.errorPages.globalError.retry}</Button>
          <Button href={routes.home} variant="outline">
            {en.errorPages.globalError.home}
          </Button>
        </ErrorState>
      </body>
    </html>
  );
}
