import type { ReactNode } from 'react';
import { tbcConfig } from '@/domain/config';
import { en, fill } from '@/domain/copy';
import { printSectionIds } from '@/features/report';
import type { PrintSectionId } from '@/features/report';
import { TbcValue } from '@/patterns';
import { Button, Icon, Select, Switch } from '@/ui';
import styles from './PdfOptions.module.css';

export type PdfOptionsProps = {
  sections: readonly PrintSectionId[];
  onSectionChange: (id: PrintSectionId, on: boolean) => void;
  logoOn: boolean;
  onLogoChange: (on: boolean) => void;
  onDownload: () => void;
};

const copy = en.pdfExport.options;

const languages = [
  { value: 'en', label: copy.english },
  { value: 'vi', label: `${copy.vietnamese} ${en.status.tbc}`, disabled: true },
] as const;

/** The side panel: what goes in, language, logo and the download button. */
export function PdfOptions({
  sections,
  onSectionChange,
  logoOn,
  onLogoChange,
  onDownload,
}: PdfOptionsProps): ReactNode {
  const count = fill(copy.count, { n: sections.length, total: printSectionIds.length });
  return (
    <aside className={styles.panel} aria-label={copy.label} data-print="hide">
      <div className={styles.head}>
        <span className={styles.eyebrow}>{copy.eyebrow}</span>
        <h2 className={styles.title}>{copy.title}</h2>
      </div>

      <div role="group" aria-labelledby="pdf-include-label" className={styles.group}>
        <span id="pdf-include-label" className={styles.groupLabel}>
          {fill(copy.includeLabel, { count })}
        </span>
        {printSectionIds.map((id) => (
          <Switch
            key={id}
            label={en.report.print.sections[id]}
            checked={sections.includes(id)}
            onChange={(on) => onSectionChange(id, on)}
            onLabel={copy.on}
            offLabel={copy.off}
          />
        ))}
      </div>

      <Select label={copy.languageLabel} options={languages} defaultValue="en" />

      <div className={styles.group}>
        <Switch
          label={copy.logoLabel}
          checked={logoOn}
          onChange={onLogoChange}
          onLabel={copy.on}
          offLabel={copy.off}
        />
        {logoOn ? (
          <div className={styles.logoBox}>
            <TbcValue
              value={tbcConfig.pdfInstitutionLogoUpload}
              placeholder={copy.logoPlaceholder}
            />
          </div>
        ) : null}
      </div>

      <div className={styles.action}>
        <Button size="lg" fullWidth onClick={onDownload}>
          <Icon name="download" size={20} strokeWidth={2.4} />
          <span>{en.pdfExport.action.download}</span>
        </Button>
        <p className={styles.hint}>{en.pdfExport.action.hint}</p>
      </div>
    </aside>
  );
}
