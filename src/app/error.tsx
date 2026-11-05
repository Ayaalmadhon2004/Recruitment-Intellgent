'use client';

import type { ReactNode } from 'react';
import { routes } from '@/domain/config';
import { en } from '@/domain/copy';
import { ErrorState } from '@/shell';
import { Button } from '@/ui';

/** Shown when a page throws while rendering. Offers a retry and a way home; never the error text. */
export default function Error({ reset }: { error: Error; reset: () => void }): ReactNode {
  return (
    <ErrorState
      as="main"
      eyebrow={en.errorPages.error.eyebrow}
      title={en.errorPages.error.title}
      body={en.errorPages.error.body}
    >
      <Button onClick={reset}>{en.errorPages.error.retry}</Button>
      <Button href={routes.home} variant="outline">
        {en.errorPages.error.home}
      </Button>
    </ErrorState>
  );
}
