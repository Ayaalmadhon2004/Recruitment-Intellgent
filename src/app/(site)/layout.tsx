import type { ReactNode } from 'react';
import { SiteChrome } from '../SiteChrome';

export default function SiteLayout({ children }: { children: ReactNode }): ReactNode {
  return <SiteChrome>{children}</SiteChrome>;
}
