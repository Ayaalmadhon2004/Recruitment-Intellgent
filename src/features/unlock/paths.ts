import { tbcConfig, unlockConfig } from '@/domain/config';
import type { TbcConfig, UnlockConfig } from '@/domain/config';
import { t } from '@/domain/copy';

/** One option on the Choose step, whether it is real or a labelled stand-in. */
export type ResolvedUnlockPath = {
  readonly id: string;
  readonly label: string;
  readonly note: string | null;
  /** False for the design's stand-in options: the label is then the TBC placeholder text. */
  readonly confirmed: boolean;
};

/**
 * The unlock options to show. Confirmed paths from `tbcConfig.unlockPaths` when Capstone has given them,
 * otherwise the three labelled placeholders from `unlock.config.ts`. Nothing is invented here.
 */
export function resolveUnlockPaths(
  tbc: Pick<TbcConfig, 'unlockPaths'> = tbcConfig,
  config: Pick<UnlockConfig, 'placeholderPaths'> = unlockConfig,
): readonly ResolvedUnlockPath[] {
  if (tbc.unlockPaths !== null && tbc.unlockPaths.length > 0) {
    return tbc.unlockPaths.map((p) => ({
      id: p.id,
      label: p.label,
      note: p.note,
      confirmed: true,
    }));
  }
  return config.placeholderPaths.map((p) => ({
    id: p.id,
    label: t(p.labelKey),
    note: null,
    confirmed: false,
  }));
}
