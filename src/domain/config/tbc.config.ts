/**
 * Everything not yet known, as null. The UI renders each through TbcValue as
 * "[TO BE CONFIRMED WITH CAPSTONE]". Never replace a null with a guess.
 * Numbers refer to docs/DOMAIN-AND-OPEN-ITEMS.md. Fill a value only when Capstone confirms it.
 */
import type { UnlockPath } from '../types/unlock';

export type Tbc<T> = T | null;

export const tbcConfig = {
  /** 1. Scoring formulas and how answers map to each area. */
  scoringFormulas: null as Tbc<string>,
  /** 2. The full structured list of 40 questions and the 5 Quick Start ids. */
  fullQuestionList: null as Tbc<string>,
  quickStartQuestionIds: null as Tbc<readonly string[]>,
  /** 3. A worked sample audit with expected scores. */
  workedSampleAudit: null as Tbc<string>,
  /** 4. Final band cut-offs. */
  finalBandCutoffs: null as Tbc<string>,
  /** 5. Free vs locked line, unlock path and pricing. */
  freeVsLockedLine: null as Tbc<string>,
  /** Each way to unlock, once confirmed. While null the screen shows three labelled placeholder options. */
  unlockPaths: null as Tbc<readonly UnlockPath[]>,
  pricing: null as Tbc<string>,
  unlockTiming: null as Tbc<string>,
  /** 6. Advisor channels, name and photo. */
  advisorWhatsapp: null as Tbc<string>,
  advisorEmail: null as Tbc<string>,
  advisorCallDetails: null as Tbc<string>,
  advisorName: null as Tbc<string>,
  advisorPhotoUrl: null as Tbc<string>,
  advisorReplyTime: null as Tbc<string>,
  /** 7. Hosting, retention, privacy, database and auth provider. */
  dataHosting: null as Tbc<string>,
  dataRetention: null as Tbc<string>,
  privacyPolicyUrl: null as Tbc<string>,
  database: null as Tbc<string>,
  authProvider: null as Tbc<string>,
  /** How long a sign-in link works (minutes or words, as Capstone states it). Shown on the check-your-inbox step. */
  signInLinkExpiry: null as Tbc<string>,
  /** 8. Whether live web research is part of the report. */
  liveWebResearch: null as Tbc<boolean>,
  /** 9. Brand assets. */
  logoSvgUrl: null as Tbc<string>,
  photoUrls: null as Tbc<readonly string[]>,
  brandHexConfirmed: null as Tbc<boolean>,
  /** Seen in the design as placeholders. */
  vndExchangeRate: null as Tbc<number>,
  reportDate: null as Tbc<string>,
  pdfInstitutionLogoUpload: null as Tbc<string>,
};

export type TbcConfig = typeof tbcConfig;
