import type { Audit } from '@/domain/types';
import { loadStoredAudit } from '@/features/intake';
import { readQuickStartAnswers } from '@/features/quick-start';
import { readDeviceEntitlement } from '@/features/unlock';

/** The audit kept on this device (Intake answers, else Quick Start answers) with its stored entitlement. */
export function loadDeviceAudit(): Audit | null {
  const audit = loadStoredAudit({ fallbackAnswers: readQuickStartAnswers });
  // DEVELOPMENT: the entitlement is read from the device and the server believes it (docs/DECISIONS.md 7).
  return audit ? { ...audit, entitlement: readDeviceEntitlement() } : null;
}
