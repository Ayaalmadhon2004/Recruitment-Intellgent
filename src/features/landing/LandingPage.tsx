import type { ReactNode } from 'react';
import { auditScope, routes, tbcConfig } from '@/domain/config';
import { en, fill } from '@/domain/copy';
import { CtaBand } from '@/patterns';
import { PageContainer, WaveDivider } from '@/shell';
import { FreeOrFull } from './components/FreeOrFull';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { PrivacyStrip } from './components/PrivacyStrip';
import { WhatYouGet } from './components/WhatYouGet';
import styles from './LandingPage.module.css';

const copy = en.landing.finalCta;

export type LandingPageProps = {
  /** Where the audit starts. */
  startHref?: string;
  /** Defaults to tbc.config. Null renders the placeholder. */
  pricing?: string | null;
  privacyPolicyUrl?: string | null;
};

export function LandingPage({
  startHref = routes.quickStart,
  pricing = tbcConfig.pricing,
  privacyPolicyUrl = tbcConfig.privacyPolicyUrl,
}: LandingPageProps): ReactNode {
  return (
    <>
      <Hero startHref={startHref} />
      <section className={`${styles.band} ${styles.bandWhite}`}>
        <PageContainer className={styles.sections}>
          <WhatYouGet />
        </PageContainer>
      </section>
      <WaveDivider from="card" to="page" />
      <section className={`${styles.band} ${styles.bandBlue}`}>
        <PageContainer className={styles.sections}>
          <HowItWorks />
        </PageContainer>
      </section>
      <WaveDivider from="page" to="warm" />
      <section className={`${styles.band} ${styles.bandWarm}`}>
        <PageContainer className={styles.sections}>
          <FreeOrFull startHref={startHref} pricing={pricing} />
        </PageContainer>
      </section>
      <WaveDivider from="warm" to="card" />
      <section className={`${styles.band} ${styles.bandWhite}`}>
        <PageContainer className={styles.sections}>
          <PrivacyStrip privacyPolicyUrl={privacyPolicyUrl} />
          <CtaBand
            title={copy.title}
            body={fill(copy.body, { quickStart: auditScope.quickStartQuestions })}
            actions={[
              { label: copy.primary, href: startHref },
              { label: copy.secondary, href: en.site.url, variant: 'inverse-outline' },
            ]}
          />
        </PageContainer>
      </section>
    </>
  );
}
