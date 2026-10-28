import type { ReactNode } from 'react';
import { en } from '@/domain/copy';
import { forecast } from '@/domain/scoring';
import { Card, Field } from '@/ui';
import { fill, fmt1, parseForecast } from './format';
import type { ForecastFormValues } from './types';
import styles from './AgentStrategy.module.css';

const copy = en.agentStrategy.forecast;

export type ForecastSectionProps = {
  values: ForecastFormValues;
  onChange: (values: ForecastFormValues) => void;
};

export function ForecastSection({ values, onChange }: ForecastSectionProps): ReactNode {
  const { inputs, percents } = parseForecast(values);
  const result = forecast(inputs);

  const steps = [
    {
      key: 'applications',
      field: copy.fields.applications,
      running: Math.round(result.qualifiedApplications).toString(),
    },
    { key: 'offerRate', field: copy.fields.offerRate, running: fmt1(result.offers) },
    { key: 'enrolmentYield', field: copy.fields.enrolmentYield, running: fmt1(result.enrolled) },
    { key: 'visaRetention', field: copy.fields.visaRetention, running: fmt1(result.retained) },
  ] as const;

  return (
    <div className={styles.subBlock}>
      <p className={styles.formula}>{copy.formula}</p>
      <div className={styles.steps}>
        {steps.map((step, index) => (
          <div key={step.key} className={styles.stepWrap}>
            {index > 0 ? (
              <span aria-hidden="true" className={styles.operator}>
                {copy.operator}
              </span>
            ) : null}
            <Card radius="md" lift className={styles.stepCard}>
              <span className={styles.eyebrow}>{fill(copy.step, { n: index + 1 })}</span>
              <Field
                label={step.field.label}
                type="number"
                inputMode="numeric"
                min={0}
                value={values[step.key]}
                hint={fill(step.field.running, { value: step.running })}
                onChange={(e) => onChange({ ...values, [step.key]: e.target.value })}
              />
            </Card>
          </div>
        ))}
      </div>
      <Card tone="navy" radius="lg" className={styles.result}>
        <div className={styles.resultMain} role="status">
          <span className={styles.resultEyebrow}>{copy.resultEyebrow}</span>
          <span className={styles.resultBig}>{fmt1(result.retained)}</span>
          <span>{fill(copy.resultLine, { count: Math.round(result.retained) })}</span>
        </div>
        <div className={styles.resultNote}>
          <span>
            {fill(copy.calcLine, {
              applications: Math.round(result.qualifiedApplications),
              offerRate: percents.offerRate,
              enrolmentYield: percents.enrolmentYield,
              visaRetention: percents.visaRetention,
              result: fmt1(result.retained),
            })}
          </span>
          <strong>{copy.sampleNote}</strong>
        </div>
      </Card>
    </div>
  );
}
