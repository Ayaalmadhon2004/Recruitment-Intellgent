import type { ReactNode } from 'react';
import { tbcConfig } from '@/domain/config';
import { en } from '@/domain/copy';
import { CtaBand, TbcValue } from '@/patterns';

export type UnlockPromptProps = {
  /** Where "Unlock full report" goes. Without it the button is not shown. */
  unlockHref?: string;
};

const copy = en.report.unlock;

/** Asks to unlock the full report. The unlock path and the price are not confirmed, so they show as such. */
export function UnlockPrompt({ unlockHref }: UnlockPromptProps): ReactNode {
  return (
    <CtaBand
      eyebrow={copy.eyebrow}
      title={copy.title}
      body={copy.body}
      note={
        <>
          {copy.pathLabel}:{' '}
          <TbcValue value={tbcConfig.unlockPaths?.join(', ')} placeholder={en.status.tbc} />
          {'. '}
          {copy.priceLabel}: <TbcValue value={tbcConfig.pricing} placeholder={en.status.tbc} />
        </>
      }
      actions={unlockHref ? [{ label: copy.cta, href: unlockHref }] : []}
    />
  );
}
