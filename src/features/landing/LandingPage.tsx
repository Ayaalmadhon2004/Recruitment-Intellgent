import type { ReactNode } from 'react';
import { routes, tbcConfig } from '@/domain/config';
import { en } from '@/domain/copy';
import { CtaBand } from '@/patterns';
import { PageContainer } from '@/shell';
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
      <PageContainer className={styles.sections}>
        <WhatYouGet />
        <HowItWorks />
        <FreeOrFull startHref={startHref} pricing={pricing} />
        <PrivacyStrip privacyPolicyUrl={privacyPolicyUrl} />
        <CtaBand
          title={copy.title}
          body={copy.body}
          actions={[
            { label: copy.primary, href: startHref },
            { label: copy.secondary, href: en.site.url, variant: 'inverse-outline' },
          ]}
        />
      </PageContainer>
    </>
  );
}
