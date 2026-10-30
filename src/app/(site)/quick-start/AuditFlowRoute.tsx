'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import type { ReactNode } from 'react';
import { routes } from '@/domain/config';
import { AccountAuditFlow } from '@/features/accounts';
import type { AuditPhase } from '@/features/intake';
import { useDeviceEntitlement } from '@/features/unlock';

/** The address parameter that names a phase of the audit. */
export const PHASE_PARAM = 'phase';

const phases: readonly AuditPhase[] = ['questions', 'read', 'sections'];

const phaseHref = (phase: AuditPhase): string => `${routes.quickStart}?${PHASE_PARAM}=${phase}`;

const parsePhase = (value: string | null): AuditPhase | undefined =>
  phases.find((phase) => phase === value);

/**
 * Composes the one continuous audit: Quick Start questions, free first read, remaining sections.
 * The phase lives in the address, so the browser's Back button and the old /first-read and /intake
 * links (which redirect here) land in the right place. The unlock link shows only while the audit
 * is known to be free (Quick Start cannot read entitlement itself: that would be a dependency cycle).
 */
export function AuditFlowRoute(): ReactNode {
  const router = useRouter();
  const phase = parsePhase(useSearchParams().get(PHASE_PARAM));
  const entitlement = useDeviceEntitlement();
  return (
    <AccountAuditFlow
      signInHref={`${routes.signIn}?next=${encodeURIComponent(routes.quickStart)}`}
      phase={phase}
      phaseHref={phaseHref}
      onPhaseChange={(next) => router.push(phaseHref(next))}
      reportHref={routes.report}
      unlockHref={entitlement === 'free' ? routes.unlock : undefined}
    />
  );
}
