import type { CopyKey } from '../copy';
import type { ScoreAreaId } from './ids';

/** A next step, ranked by impact. `impact` is relative: larger comes first. The scale is an open item. */
export type Recommendation = {
  readonly id: string;
  readonly areaId: ScoreAreaId;
  readonly titleKey: CopyKey;
  readonly impact: number;
};
