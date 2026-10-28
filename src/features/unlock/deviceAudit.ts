import { createActiveAuditPointer } from '@/features/accounts';
import type { ActiveAuditPointer } from '@/features/accounts';
import { LOCAL_AUDIT_ID, loadStoredAudit } from '@/features/intake';
import { readQuickStartAnswers } from '@/features/quick-start';
import type { Entitlement } from '@/domain/types';
import { readStoredEntitlement } from './service/dev-service';

/**
 * The audit key the device working copy belongs to: the active account audit, or the anonymous constant.
 * The Report reads the same working copy, so an unlock made here is the one it sees.
 */
export function deviceAuditKey(pointer: ActiveAuditPointer = createActiveAuditPointer()): string {
  return pointer.get() ?? LOCAL_AUDIT_ID;
}

/** True when this device holds answers (Intake, or Quick Start when the Intake has none) to unlock a report for. */
export function deviceHasAudit(): boolean {
  return loadStoredAudit({ fallbackAnswers: readQuickStartAnswers }) !== null;
}

/**
 * DEVELOPMENT. The entitlement of the audit on this device, read synchronously from the development
 * store, for the Report to attach to the audit it posts. A real unlock path removes this: the server looks
 * the entitlement up itself and ignores what the browser claims (docs/DECISIONS.md 7).
 */
export function readDeviceEntitlement(): Entitlement {
  return readStoredEntitlement(deviceAuditKey()).entitlement;
}
