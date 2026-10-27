import type { Audit } from '@/domain/types';
import { loadStoredAudit } from '@/features/intake';
import { readQuickStartAnswers } from '@/features/quick-start';

/** The audit kept on this device: the Intake answers, or the Quick Start answers when the Intake has none. */
export function loadDeviceAudit(): Audit | null {
  return loadStoredAudit({ fallbackAnswers: readQuickStartAnswers });
}
