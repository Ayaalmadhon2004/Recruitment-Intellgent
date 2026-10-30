import type { ReactNode } from 'react';
import { en } from '@/domain/copy';
import { forecast } from '@/domain/scoring';
import { strategyCopy } from '@/design/ui-copy';
import { CountUp, Field, Icon } from '@/ui';
import { enrolmentShare, fill, fmt1, parseForecast } from './format';
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
  const share = enrolmentShare(result.retained, result.qualifiedApplications);
  const ringText = fill(copy.ringText, { percent: Math.round(share) });

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
    <div className={styles.forecast}>
      {/* First in the source so it can stick to the top on small screens; on desktop it sits beside the inputs. */}
      <div className={styles.resultDock}>
        <div className={styles.result} role="status" aria-label={strategyCopy.forecastLive}>
          <div className={styles.resultCircle}>
            <svg className={styles.ring} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
              <circle className={styles.ringTrack} cx="50" cy="50" r="47" />
              <circle
                className={styles.ringFill}
                cx="50"
                cy="50"
                r="47"
                pathLength="100"
                style={{ strokeDasharray: `${share} 100`, opacity: share > 0 ? 1 : 0 }}
              />
            </svg>
            <div className={styles.resultCore}>
              <span className={styles.resultEyebrow}>{copy.resultEyebrow}</span>
              <span className="visually-hidden">{fmt1(result.retained)}</span>
              <span aria-hidden="true" className={styles.resultBig}>
                <CountUp value={result.retained} format={fmt1} />
              </span>
              <span className={styles.resultLine}>
                {fill(copy.resultLine, { count: Math.round(result.retained) })}
              </span>
            </div>
          </div>
          <p className={styles.ringText}>{ringText}</p>
        </div>
      </div>
      <div className={styles.forecastForm}>
        <p className={styles.formula}>{copy.formula}</p>
        <div className={styles.steps}>
          {steps.map((step, index) => (
            <div key={step.key} className={styles.stepGroup}>
              {index > 0 ? (
                <div aria-hidden="true" className={styles.joint}>
                  <span className={styles.operator}>{copy.operator}</span>
                </div>
              ) : null}
              <div className={styles.step}>
                <span aria-hidden="true" className={styles.marker}>
                  {index + 1}
                </span>
                <span className="visually-hidden">{fill(copy.step, { n: index + 1 })}</span>
                <Field
                  label={step.field.label}
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={values[step.key]}
                  hint={fill(step.field.running, { value: step.running })}
                  hintClassName={styles.runPill}
                  onChange={(e) => onChange({ ...values, [step.key]: e.target.value })}
                />
              </div>
            </div>
          ))}
        </div>
        <p className={styles.calcLine}>
          {fill(copy.calcLine, {
            applications: Math.round(result.qualifiedApplications),
            offerRate: percents.offerRate,
            enrolmentYield: percents.enrolmentYield,
            visaRetention: percents.visaRetention,
            result: fmt1(result.retained),
          })}
        </p>
        <p className={styles.sampleNote}>
          <Icon name="info" size={16} strokeWidth={2.4} />
          <strong>{copy.sampleNote}</strong>
        </p>
      </div>
    </div>
  );
}
