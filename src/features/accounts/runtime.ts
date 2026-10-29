import { domainConfig, isDevelopmentBuild } from '@/domain/config';
import type { Answer, DomainConfig } from '@/domain/types';
import { createLocalStorageStore } from '@/features/intake';
import type { AnswerStore } from '@/features/intake';
import { clearQuickStartAnswers, readQuickStartAnswers } from '@/features/quick-start';
import { createActiveAuditPointer } from './service/active-audit';
import type { ActiveAuditPointer } from './service/active-audit';
import { createDevAccountService } from './service/dev-service';
import type { AccountService } from './service/types';

/** Everything the account screens touch outside React. Swap `service` for a real provider. */
export type AccountsRuntime = {
  service: AccountService;
  /** The working copy the Intake and the Report read and write on this device. */
  localStore: AnswerStore;
  active: ActiveAuditPointer;
  quickStart: {
    read: () => readonly Answer[] | undefined;
    clear: () => void;
  };
  config: DomainConfig;
  /** True only in `next dev`, while `service` is the development service. Never true for real users. */
  isDevelopment: boolean;
};

export function createDefaultRuntime(): AccountsRuntime {
  return {
    service: createDevAccountService(),
    localStore: createLocalStorageStore(),
    active: createActiveAuditPointer(),
    quickStart: { read: readQuickStartAnswers, clear: clearQuickStartAnswers },
    config: domainConfig,
    isDevelopment: isDevelopmentBuild,
  };
}

let shared: AccountsRuntime | undefined;

/** One runtime per page load. Browser only: do not call during server rendering. */
export function getDefaultRuntime(): AccountsRuntime {
  shared ??= createDefaultRuntime();
  return shared;
}
