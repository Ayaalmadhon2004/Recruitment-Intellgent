import type { DomainConfig } from '../types';
import { accountsConfig } from './accounts.config';
import { accessConfig } from './access.config';
import { agentsConfig } from './agents.config';
import { auditScope } from './audit.config';
import { evidenceConfig } from './evidence.config';
import { questionsConfig } from './questions.config';
import { scoringConfig } from './scoring.config';
import { stagesConfig } from './stages.config';
import { routes } from './routes.config';
import { tbcConfig } from './tbc.config';
import { unlockConfig } from './unlock.config';
import { CONFIG_VERSION } from './version';

export {
  accessConfig,
  accountsConfig,
  agentsConfig,
  auditScope,
  evidenceConfig,
  questionsConfig,
  routes,
  scoringConfig,
  stagesConfig,
  tbcConfig,
  unlockConfig,
  CONFIG_VERSION,
};
export type { Tbc, TbcConfig } from './tbc.config';
export type {
  PlaceholderUnlockPath,
  UnlockConfig,
  UnlockExampleItem,
} from './unlock.config';

export const domainConfig: DomainConfig = {
  version: CONFIG_VERSION,
  questions: questionsConfig,
  scoring: scoringConfig,
  stages: stagesConfig,
  agents: agentsConfig,
  evidence: evidenceConfig,
  access: accessConfig,
};
