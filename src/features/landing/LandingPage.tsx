import type { ReactNode } from 'react';
import { routes, tbcConfig } from '@/domain/config';
import { en } from '@/domain/copy';
import { PageContainer, PlainSection, WaveDivider } from '@/shell';
import { FinalCta } from './components/FinalCta';
import { FreeOrFull } from './components/FreeOrFull';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { PrivacyStrip } from './components/PrivacyStrip';
import { WhatYouGet } from './components/WhatYouGet';
import styles from './LandingPage.module.css';

const copy = en.landing;

export type LandingPageProps = {
  /** Where the audit starts. */
  startHref?: string;
  /** Defaults to tbc.config. Null renders the placeholder. */
  pricing?: string | null;
  privacyPolicyUrl?: string | null;
};

/** Hero banner, the site's one wave, then plain sections set on the page background. */
export function LandingPage({
  startHref = routes.quickStart,
  pricing = tbcConfig.pricing,
  privacyPolicyUrl = tbcConfig.privacyPolicyUrl,
}: LandingPageProps): ReactNode {
  return (
    <>
      <Hero startHref={startHref} />
      <WaveDivider from="blue" to="page" />
      <div id="get" className={styles.anchor}>
        <PlainSection eyebrow={copy.get.eyebrow} title={copy.get.title}>
          <WhatYouGet />
        </PlainSection>
      </div>
      <div id="how" className={styles.anchor}>
        <PlainSection eyebrow={copy.how.eyebrow} title={copy.how.title} separator="line">
          <HowItWorks />
        </PlainSection>
      </div>
      <div id="compare" className={styles.anchor}>
        <PlainSection eyebrow={copy.compare.eyebrow} title={copy.compare.title} separator="line">
          <FreeOrFull startHref={startHref} pricing={pricing} />
        </PlainSection>
      </div>
      <PageContainer className={styles.privacy}>
        <PrivacyStrip privacyPolicyUrl={privacyPolicyUrl} />
      </PageContainer>
      <FinalCta startHref={startHref} />
    </>
  );
}
