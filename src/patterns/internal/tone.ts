import type { BandId } from '@/domain/types';

export type StatusTone = 'strong' | 'caution' | 'concern' | 'info';

/** Band to status colour. The word and icon are always shown too, never colour alone. */
export function bandTone(band: BandId): StatusTone {
  switch (band) {
    case 'strong':
      return 'strong';
    case 'developing':
      return 'caution';
    case 'needs-attention':
      return 'concern';
  }
}
