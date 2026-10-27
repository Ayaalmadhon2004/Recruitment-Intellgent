import type { DomainConfig } from '../types';
import { agentsConfig } from './agents.config';
import { questionsConfig } from './questions.config';
import { scoringConfig } from './scoring.config';
import { stagesConfig } from './stages.config';
import { tbcConfig } from './tbc.config';
import { CONFIG_VERSION } from './version';

export { agentsConfig, questionsConfig, scoringConfig, stagesConfig, tbcConfig, CONFIG_VERSION };
export type { Tbc, TbcConfig } from './tbc.config';

export const domainConfig: DomainConfig = {
  version: CONFIG_VERSION,
  questions: questionsConfig,
  scoring: scoringConfig,
  stages: stagesConfig,
  agents: agentsConfig,
};
