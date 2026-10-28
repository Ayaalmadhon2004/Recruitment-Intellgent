/**
 * One way to unlock the full report (payment, a code, an advisor...). Which ones exist is unknown (open item 5),
 * so `tbcConfig.unlockPaths` is null until Capstone confirms them. The id is stored with the entitlement; the
 * label and note are what Capstone wants the person to read.
 */
export type UnlockPath = {
  readonly id: string;
  readonly label: string;
  readonly note: string | null;
};
