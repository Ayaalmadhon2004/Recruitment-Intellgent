import { isDevelopmentBuild } from '@/domain/config';
import { deviceAuditKey, deviceHasAudit } from './deviceAudit';
import { createDevEntitlementService } from './service/dev-service';
import type { EntitlementService } from './service/types';

/** Everything the Unlock screen touches outside React. Swap `service` for a real unlock path. */
export type UnlockRuntime = {
  service: EntitlementService;
  /** The audit being unlocked: the active account audit, or the anonymous working copy. */
  auditKey: () => string;
  /** False when there are no answers on this device, so there is no report to unlock yet. */
  hasAudit: () => boolean;
  /** True only in `next dev`, while `service` is the development service. Never true for real users. */
  isDevelopment: boolean;
};

export function createDefaultRuntime(): UnlockRuntime {
  return {
    service: createDevEntitlementService(),
    auditKey: () => deviceAuditKey(),
    hasAudit: deviceHasAudit,
    isDevelopment: isDevelopmentBuild,
  };
}

let shared: UnlockRuntime | undefined;

/** One runtime per page load. Browser only: do not call during server rendering. */
export function getDefaultRuntime(): UnlockRuntime {
  shared ??= createDefaultRuntime();
  return shared;
}
