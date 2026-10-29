'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';
import { domainConfig } from '@/domain/config';
import { en } from '@/domain/copy';
import { sectionIds } from '@/domain/types';
import { CtaBand } from '@/patterns';
import { createLocalStorageStore } from '../../store';
import type { AnswerStore } from '../../store';
import { questionsInSection, useIntake } from '../../state';
import { EvidenceHelp } from '../EvidenceHelp';
import { IntakeNav } from '../IntakeNav';
import { IntakeOverview } from '../IntakeOverview';
import { IntakeSection } from '../IntakeSection';
import { SectionNav } from '../SectionNav';
import { IntakeSkeleton } from './IntakeSkeleton';
import styles from './IntakePage.module.css';

export type IntakePageProps = {
  /** Where "See my report" and "Open report" go. */
  reportHref: string;
  /** Where "Save and exit" goes. Progress is written when the page is left. */
  exitHref: string;
  /** Where progress is kept. Defaults to this browser; Feature 5 can pass a database-backed store. */
  store?: AnswerStore;
};

const copy = en.intake;
const lastIndex = sectionIds.length - 1;

const subscribe = (): (() => void) => () => undefined;
// The saved audit lives in the browser, so the audit is drawn on the client only.
const useIsClient = (): boolean =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

type BodyProps = IntakePageProps & { store: AnswerStore };

function IntakeBody({ reportHref, exitHref, store }: BodyProps): ReactNode {
  const intake = useIntake(store);
  const { sectionIndex } = intake.state;
  const sectionId = sectionIds[sectionIndex] ?? sectionIds[0];
  const progress = intake.sections[sectionIndex] ?? intake.sections[0];

  const headingRef = useRef<HTMLHeadingElement>(null);
  const focusHeading = useRef(false);
  useEffect(() => {
    if (!focusHeading.current) return;
    focusHeading.current = false;
    headingRef.current?.focus();
  }, [sectionIndex]);

  // Back and Next sit under the questions, so the new section's heading takes focus and scrolls into view.
  const step = (index: number, save: boolean): void => {
    focusHeading.current = true;
    if (save) intake.saveAndGoToSection(index);
    else intake.goToSection(index);
  };

  if (!progress) return null;
  const previous = sectionIndex > 0 ? sectionIds[sectionIndex - 1] : undefined;
  const next = sectionIndex < lastIndex ? sectionIds[sectionIndex + 1] : undefined;

  return (
    <div className={styles.root}>
      <IntakeOverview
        handled={intake.overall.handled}
        total={intake.overall.total}
        unsure={intake.overall.unsure}
        saveStatus={intake.saveStatus}
        onSaveNow={intake.saveNow}
        resumedSection={intake.resumed ? sectionIds[intake.resumedSectionIndex] : undefined}
        versionChanged={intake.versionChanged}
      />

      <div className={styles.group}>
        <SectionNav
          sections={intake.sections}
          current={sectionIndex}
          onSelect={intake.goToSection}
        />
        <EvidenceHelp />
      </div>

      <IntakeSection
        progress={progress}
        questions={questionsInSection(domainConfig.questions, sectionId)}
        state={intake.state}
        onAnswer={intake.answer}
        onClear={intake.clear}
        onNotSure={intake.toggleNotSure}
        onEvidence={intake.pickEvidence}
        headingRef={headingRef}
      >
        <IntakeNav
          previous={previous}
          next={next}
          onPrevious={() => step(sectionIndex - 1, false)}
          onNext={() => step(sectionIndex + 1, true)}
          reportHref={reportHref}
        />
      </IntakeSection>

      <CtaBand
        tone="inline"
        title={copy.pause.title}
        body={copy.pause.body}
        actions={[
          { label: copy.pause.exit, href: exitHref, variant: 'inverse' },
          { label: copy.pause.report, href: reportHref, variant: 'inverse-outline' },
        ]}
      />
    </div>
  );
}

/** The full audit intake: overview, section navigation, the current section's questions, and saving. */
export function IntakePage(props: IntakePageProps): ReactNode {
  const isClient = useIsClient();
  const [defaultStore] = useState(() => createLocalStorageStore());
  if (!isClient) {
    return <IntakeSkeleton />;
  }
  return <IntakeBody {...props} store={props.store ?? defaultStore} />;
}
