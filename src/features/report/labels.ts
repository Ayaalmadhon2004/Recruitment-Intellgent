import { scoringConfig } from '@/domain/config';
import { en, fill, t } from '@/domain/copy';
import type { GaugeId, ScoreAreaId } from '@/domain/types';
import type { RadarChartLabels } from '@/patterns';

/** Area name from the scoring config's copy key. */
export const areaName = (id: ScoreAreaId): string => {
  const area = scoringConfig.areas.find((a) => a.id === id);
  return area ? t(area.nameKey) : en.areas[id];
};

export const gaugeName = (id: GaugeId): string => en.gauges[id];

export const radarLabels: RadarChartLabels = {
  title: en.report.radar.title,
  areaHeader: en.report.radar.areaHeader,
  scoreHeader: en.report.radar.scoreHeader,
  notScorable: en.status.notScorable,
  valueText: (value) => fill(en.report.radar.valueText, { value: Math.round(value) }),
};

export const gaugeAria = (name: string, value: number): string =>
  fill(en.report.gauges.aria, { name, value: value.toFixed(1) });
