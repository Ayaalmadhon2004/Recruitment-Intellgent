import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { en } from '@/domain/copy';
import { NotFoundMessage } from './NotFoundMessage';
import { SiteChrome } from './SiteChrome';

export const metadata: Metadata = { title: en.pageError.notFound.title };

/** Any address that matches no page: the usual header and footer, and two ways back in. */
export default function NotFound(): ReactNode {
  return (
    <SiteChrome>
      <NotFoundMessage />
    </SiteChrome>
  );
}
