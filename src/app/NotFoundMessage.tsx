'use client';

import type { ReactNode } from 'react';
import { routes } from '@/domain/config';
import { en } from '@/domain/copy';
import { PageMessage } from '@/shell';
import { Button } from '@/ui';

const copy = en.pageError.notFound;

/** The not-found message and its two ways back in. A client component because the buttons carry the paper plane. */
export function NotFoundMessage(): ReactNode {
  return (
    <PageMessage title={copy.title} body={copy.body}>
      <Button href={routes.home}>{copy.home}</Button>
      <Button href={routes.quickStart} variant="outline">
        {copy.quickStart}
      </Button>
    </PageMessage>
  );
}
