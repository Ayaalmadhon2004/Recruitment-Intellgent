import type { ReactNode } from 'react';

/** Page transition: each page's content fades in with a short rise. No wipes, no layout movement. */
export default function SiteTemplate({ children }: { children: ReactNode }): ReactNode {
  return <div className="anim-up">{children}</div>;
}
