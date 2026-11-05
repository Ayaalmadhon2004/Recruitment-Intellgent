'use client';

import type { ReactNode } from 'react';
import { routes } from '@/domain/config';
import { en } from '@/domain/copy';
import { ErrorState } from '@/shell';
import { Button } from '@/ui';

/**
 * Shown for any address that matches no page, and when a page calls `notFound()`. A client
 * component because `Button` uses hooks, so the title is set with a hoisted `<title>` rather than
 * a `metadata` export.
 */
export default function NotFound(): ReactNode {
  return (
    <>
      <title>{en.errorPages.notFound.documentTitle}</title>
      <ErrorState
        as="main"
        eyebrow={en.errorPages.notFound.eyebrow}
        title={en.errorPages.notFound.title}
        body={en.errorPages.notFound.body}
      >
        <Button href={routes.home}>{en.errorPages.notFound.home}</Button>
        <Button href={routes.quickStart} variant="outline">
          {en.errorPages.notFound.start}
        </Button>
      </ErrorState>
    </>
  );
}
