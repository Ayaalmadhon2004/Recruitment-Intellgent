import type { BandId } from '@/domain/types';
import type { StatusBadgeProps } from '@/patterns';

const tones: Record<BandId, StatusBadgeProps['tone']> = {
  strong: 'strong',
  developing: 'caution',
  'needs-attention': 'concern',
};

/** Band to status tone. The word and icon are always shown too. Patterns keep their own copy of this private. */
export const bandTone = (band: BandId): StatusBadgeProps['tone'] => tones[band];
