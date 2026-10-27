import type { ReactNode } from 'react';
import { en } from '@/domain/copy';
import { AdvisorCta } from '@/patterns';

const copy = en.report.advisor;

/** Advisor channels are not confirmed yet, so each has no link and shows the placeholder. */
export function AdvisorSection(): ReactNode {
  return (
    <div id="advisor">
      <AdvisorCta
        title={copy.title}
        body={copy.body}
        photo={{ placeholder: copy.photoPlaceholder }}
        channels={[
          { id: 'whatsapp', label: copy.whatsapp, href: null },
          { id: 'email', label: copy.email, href: null },
        ]}
        tbcText={en.status.tbc}
      />
    </div>
  );
}
