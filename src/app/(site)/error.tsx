'use client';

import type { ReactNode } from 'react';
import { routes } from '@/domain/config';
import { en } from '@/domain/copy';
import { PageMessage } from '@/shell';
import { Button } from '@/ui';

const copy = en.pageError.failure;

/** A page threw while rendering: say so, keep the header and footer, offer a retry and the way home. */
export default function PageError({ reset }: { error: Error; reset: () => void }): ReactNode {
  return (
    <PageMessage title={copy.title} body={copy.body} alert>
      <Button onClick={reset}>{copy.retry}</Button>
      <Button href={routes.home} variant="outline">
        {copy.home}
      </Button>
    </PageMessage>
  );
}
