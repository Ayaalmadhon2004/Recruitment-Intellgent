import type { ReactNode } from 'react';
import { en } from '@/domain/copy';
import { SectionHeader } from '@/shell';
import type { ReportArea } from '../../contract';
import { areaName } from '../../labels';
import { AreaEvidence } from '../AreaEvidence';
import styles from './PrintEvidence.module.css';

export type PrintEvidenceProps = {
  areas: readonly ReportArea[];
};

const copy = en.report.print.evidence;

/** Evidence and missing evidence for every area, as plain print blocks. */
export function PrintEvidence({ areas }: PrintEvidenceProps): ReactNode {
  return (
    <section className={styles.section} aria-labelledby="print-evidence-title">
      <SectionHeader id="print-evidence-title" eyebrow={copy.eyebrow} title={copy.title} />
      {areas.map((area) => (
        <div key={area.id} className={styles.area}>
          <h3 className={styles.name}>{areaName(area.id)}</h3>
          <AreaEvidence area={area} headingLevel="h4" />
        </div>
      ))}
    </section>
  );
}
