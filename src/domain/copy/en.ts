import { accounts } from './sections/accounts';
import { advisor } from './sections/advisor';
import { agentStrategy } from './sections/agentStrategy';
import { landing } from './sections/landing';
import { reportPage } from './sections/reportPage';
import { unlock } from './sections/unlock';
import { costCalc } from './sections/costCalc';
import { pdfExport } from './sections/pdfExport';
/** English UI copy. Components never hard-code text; they receive these values by key. */
export const en = {
  brand: {
    productName: 'Vietnam Recruitment Intelligence',
    logoAlt: 'Capstone Education',
    footerLine: 'Vietnam Recruitment Intelligence by Capstone Education',
  },
  footer: {
    tagline: 'Find out how ready your university is to recruit students in Vietnam.',
    navigationHeading: 'Navigation',
    toolsHeading: 'Audit tools',
    externalHeading: 'Capstone Education',
    copyright: '© 2026 Capstone Education. All rights reserved.',
  },
  site: {
    url: 'https://capstonevietnam.com',
    host: 'capstonevietnam.com',
  },
  nav: {
    label: 'Main',
    scores: 'Scores',
    nextSteps: 'Next steps',
    advisor: 'Advisor',
    footerLabel: 'Footer',
    toolsGroup: 'Tools',
    items: {
      home: 'Home',
      quickStart: 'Quick Start',
      intake: 'Full audit',
      report: 'My report',
      costCalc: 'Cost calculator',
      agentStrategy: 'Agent strategy',
      advisor: 'Talk to an advisor',
      myAudits: 'My audits',
    },
  },
  header: {
    cta: 'Start the audit',
    menuOpen: 'Open menu',
    menuClose: 'Close menu',
    signIn: 'Sign in',
    accountMenu: 'Account menu',
    signedInAs: 'Signed in as',
    myAudits: 'My audits',
    signOut: 'Sign out',
  },
  foundation: {
    eyebrow: 'FOUNDATION',
    title: 'Design tokens and shell',
  },
  status: {
    notScorable: 'Not yet scorable',
    tbc: '[TO BE CONFIRMED WITH CAPSTONE]',
    pending: 'Pending',
    sample: 'Sample data - illustrative only',
  },
  skeleton: {
    loading: 'Loading',
    report: 'Building your report',
    scoreDetail: 'Loading this score area',
    pdfExport: 'Preparing your PDF preview',
    quickStart: 'Loading the Quick Start',
    firstRead: 'Working out your first read',
    intake: 'Bringing back your saved answers',
    dashboard: 'Loading your audits',
    unlock: 'Checking your report',
    signIn: 'Loading the sign in page',
  },
  areas: {
    readiness: 'Readiness',
    competitiveness: 'Competitiveness',
    affordability: 'Affordability and ROI',
    'digital-visibility': 'Digital Visibility',
    'trust-network': 'Trust Network',
    'community-influence': 'Community Influence',
  },
  gauges: {
    'school-fit': 'School Fit',
    'agent-attractiveness': 'Agent Attractiveness',
  },
  affordabilityComponents: {
    'net-annual-cost': 'Net annual cost',
    'scholarship-attainability': 'Scholarship attainability',
    'cost-transparency': 'Cost transparency',
    'graduate-outcomes': 'Graduate outcomes',
    'academic-career-value': 'Academic and career value',
    'financial-risk-mitigation': 'Financial-risk mitigation',
  },
  priceBands: {
    'under-20k': 'Under $20k',
    '20-30k': '$20-30k',
    '30-40k': '$30-40k',
    '40-50k': '$40-50k',
    '50k-plus': '$50k+',
  },
  bands: {
    strong: 'Strong',
    developing: 'Developing',
    'needs-attention': 'Needs attention',
  },
  stages: {
    starting: { label: 'Starting', range: '0-5 students' },
    building: { label: 'Building', range: '6-15 students' },
    growing: { label: 'Growing', range: '16-30 students' },
    established: { label: 'Established', range: '31+ students' },
  },
  evidenceTags: {
    verified: 'Verified',
    'institution-reported': 'Reported by your team',
    estimate: 'Estimate',
    judgement: 'Professional view',
    unknown: 'Not sure',
  },
  confidence: {
    label: 'Confidence',
    hint: 'How firmly we can stand behind this, based on how well you know each answer behind it.',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    none: 'None yet',
  },
  scoreCard: {
    outOf: 'out of 100',
  },
  notScorable: {
    explainer: 'This area is not broken. We just do not have enough to give you a fair number yet.',
    reasons: {
      'no-formula':
        'How this area is scored is still being finalised with Capstone. Until it is, we would rather show nothing than a number we cannot stand behind.',
      'missing-answers':
        'A few more answers will open this score. We would rather wait for them than guess on your behalf.',
      'invalid-answer':
        'One of your answers could not be used. Take a quick look and correct it, and we will pick it up from there.',
    },
    missingHeading: 'Answer these to open this score',
  },
  stageStates: {
    done: 'Passed',
    current: 'You are here',
    upcoming: 'Ahead',
  },
  firstRead: {
    eyebrow: 'YOUR FREE FIRST READ',
    title: 'Your first read',
    lead: 'A first look at where you stand, based on what you have answered so far. It sharpens as you add more.',
    stageChip: 'Stage: {stage}',
    preliminaryChip: 'Preliminary result',
    progressLabel: 'Quick Start progress',
    progressText: '{answered} of {total} questions answered',
    stageEyebrow: 'YOUR STAGE',
    stageHeadline: 'You are {stage}',
    stageListLabel: 'Recruitment stages',
    scoredEyebrow: 'PREVIEW SCORES',
    scoredTitle: 'Areas we can already read',
    scoredNone:
      'We cannot fairly score any area yet, and we would rather show you nothing than a number we cannot back up. Answer a few more questions and this will fill in.',
    lockedEyebrow: 'STILL TO OPEN',
    lockedTitle: 'Areas waiting on more answers',
    ringAria: '{name} score {value} out of 100',
    ctaEyebrow: 'NEXT STEP',
    ctaTitle: 'Ready for the full picture?',
    ctaBody:
      'Everything you have answered so far is kept. Finish the full audit at your own pace to open every score.',
    ctaContinue: 'Continue to the full audit',
    ctaChange: 'Change my answers',
  },
  quickStart: {
    pageTitle: 'Quick Start',
    firstReadPageTitle: 'Your first read',
    eyebrow: 'QUICK START',
    title: '{count} questions for your first read',
    lead: 'Answer what you know. If you are not sure about one, choose Not sure. That is completely fine: we leave that area open instead of guessing, and you can come back to it any time.',
    stepperLabel: 'Quick Start questions',
    stepLabel: 'Question {n}',
    stateLabels: { done: 'Answered', current: 'You are here', upcoming: 'Ahead' },
    back: 'Back',
    next: 'Next',
    submit: 'See my first read',
    loading: 'Working out your first read',
    announce: 'Step {n} of {total}: {label}',
    submitErrorTitle: 'We could not get your first read',
    submitErrorNetwork:
      'We could not reach the server. Your answers are kept. Check your connection and try again.',
    submitErrorInvalid:
      'The server could not accept these answers. Your answers are kept. Please try again.',
    submitErrorServer: 'Something went wrong on our side. Your answers are kept. Please try again.',
    firstReadErrorTitle: 'We could not load your first read',
    firstReadRetry: 'Try again',
    noAnswersTitle: 'Your first read is waiting for you',
    noAnswersBody:
      'It takes just a few short questions, and your first read will appear right here. No documents needed.',
    noAnswersLink: 'Start the Quick Start',
  },
  report: {
    eyebrow: 'YOUR REPORT',
    lead: 'Where your university stands in Vietnam today, with clear next steps. Open any area to see what sits behind it.',
    printEyebrow: 'VIETNAM RECRUITMENT INTELLIGENCE',
    printTitle: 'Readiness report',
    stageNotScorableChip: 'Stage: needs a few more answers',
    completenessLabel: 'Audit completeness',
    continueAudit: 'Continue the audit',
    seeScores: 'See my scores',
    downloadPdf: 'Download PDF',
    stageEyebrow: 'WHERE YOU ARE',
    scoresEyebrow: 'YOUR SCORES',
    scoresTitle: 'Pick an area to explore',
    printScoresTitle: 'Scores summary',
    previewScoresEyebrow: 'YOUR AREAS',
    previewScoresTitle: 'Your six areas',
    areasTabsLabel: 'Score areas',
    tabNotScorable: 'Not yet',
    radar: {
      title: 'Scores across the six areas',
      areaHeader: 'Area',
      scoreHeader: 'Score',
      valueText: '{value} out of 100',
    },
    area: {
      evidenceHeading: 'What this is based on',
      evidenceLead: 'Each answer shows how you know it. Firmer answers make a firmer score.',
      noEvidence: 'Nothing has been answered for this area yet. Once it is, it will appear here.',
      gapsHeading: 'What would firm this up',
    },
    locked: {
      word: 'In the full report',
      body: 'Finish the audit to open this area. Your answers so far are kept.',
    },
    gauges: {
      eyebrow: 'FIT AND AGENTS',
      title: 'Two quick reads',
      outOf: 'out of 10',
      aria: '{name} {value} out of 10',
    },
    recommendations: {
      eyebrow: 'NEXT STEPS',
      title: 'Where to start',
      listLabel: 'Next steps, most impact first',
      area: 'Affects: {area}',
    },
    pilot: {
      eyebrow: 'FULL REPORT PREVIEW',
      title: 'Your {months}-month agent pilot',
      summaryMonths: '{months} months',
      summaryAgents: '{agents} agents',
      exclusive: 'Exclusive',
      nonExclusive: 'Non-exclusive',
      commission: 'Commission benchmark: {min}-{max}%',
      carouselLabel: 'Agent pilot plan',
      previous: 'Previous slide',
      next: 'Next slide',
      dots: 'Slide position',
      goTo: 'Go to slide {position}',
      slide: 'Slide {position} of {total}',
      steps: {
        first: {
          months: 'Months 1-2',
          title: 'Choose three agents',
          body: 'Use the selection matrix. Keep it non-exclusive.',
        },
        second: {
          months: 'Months 3-4',
          title: 'Run the pilot',
          body: 'Share clear scholarships. Reply within 48 hours.',
        },
        third: {
          months: 'Months 5-6',
          title: 'Review and decide',
          body: 'Compare applications, offers and enrolments.',
        },
      },
    },
    unlock: {
      eyebrow: 'FULL REPORT',
      title: 'See the whole plan',
      body: 'The agent matrix, your cost breakdown and a PDF you can share with your team.',
      cta: 'Unlock full report',
      pathLabel: 'Unlock path',
      priceLabel: 'Price',
    },
    advisor: {
      title: 'Talk it through with a person',
      body: 'A Capstone advisor will walk you through your results and answer questions you would rather ask a person.',
      photoPlaceholder: '[ADVISOR PHOTO]',
      whatsapp: 'WhatsApp',
      email: 'Email',
    },
    pdf: {
      title: 'Save this report',
      body: 'Download a copy to keep or share.',
    },
    print: {
      dateLabel: 'Date',
      pilotHeading: 'Agent pilot',
      noSections: 'Nothing is switched on yet. Turn on a section and it will appear on this page.',
      sections: {
        scores: 'Scores summary',
        steps: 'Next steps',
        afford: 'Affordability and ROI breakdown',
        pilot: '6-month agent pilot',
        evidence: 'How firm each answer is',
      },
      afford: {
        eyebrow: 'AFFORDABILITY AND ROI',
        title: 'What goes into Affordability and ROI',
        listLabel: 'Affordability components and weights',
        total: 'Total points',
        mappingLabel: 'How your answers feed each component:',
      },
      evidence: {
        eyebrow: 'EVIDENCE',
        title: 'How firm each answer is',
      },
    },
  },
  scoreDetail: {
    eyebrow: 'SCORE DETAIL',
    back: 'Back to the report',
    ringAria: '{name} score {value} out of 100',
    buildTitle: 'How this score is built',
    buildLead:
      'This score blends six parts. Some count for more than others, and together they make up 100 points.',
    componentsHeading: 'The six parts and how much each counts',
    weightText: '{weight} of {total} points',
    totalLabel: 'Total points',
    undefinedBuild: 'We are still confirming with Capstone how this area is put together:',
    evidenceTitle: 'What this score is based on',
    evidenceLead:
      'The answers behind this score, and how well you know each one. Firmer answers make a firmer score.',
    evidenceEmpty:
      'No answers are linked to this area yet. Once you answer, they will show up here.',
    evidenceListLabel: 'Evidence for this area',
    gapsTitle: 'What would make this firmer',
    gapsLead:
      'Answering these will make this score firmer. Skip any you are unsure about; that is fine.',
    gapsNone: 'Nothing is missing. Every question behind this score has an answer.',
    gapsListLabel: 'Questions still to answer',
    gapsNoneListed:
      'We cannot point to one question yet. Answering more of the audit will show what would help most.',
    recommendationsTitle: 'Recommendations',
    recommendationsLead: 'Ranked by impact, most first.',
    recommendationsLabel: 'Recommendations for this area',
    recommendationsEmpty:
      'No next steps for this area yet. We only suggest actions we can stand behind.',
  },
  agentFactors: {
    'student-fit': 'Student fit',
    'market-presence': 'Market presence',
    'city-coverage': 'City coverage',
    counselling: 'Counselling',
    compliance: 'Compliance',
    'response-speed': 'Response speed',
    'commission-fit': 'Commission fit',
  },
  sections: {
    A: 'Institution info',
    B: 'Current Vietnam performance',
    C: 'Tuition, scholarships and affordability',
    D: 'Recruitment infrastructure',
    E: 'Parents, students and alumni',
    F: 'Strategic objectives',
  },
  intake: {
    pageTitle: 'Audit intake',
    eyebrow: 'THE {total}-QUESTION AUDIT',
    title: 'Your audit',
    lead: 'Six short sections. Answer what you can and skip what you cannot: nothing here is a test. You can stop at any point and pick up later.',
    resumed: 'Resumed at Section {section}',
    overviewLabel: 'Audit overview',
    completenessLabel: 'Audit completeness',
    answeredText: '{done} of {total} answered',
    unknownText: '{count} marked Not sure. That is fine: we leave those open instead of guessing.',
    save: {
      idle: 'Your answers save on this device as you go, so you will not lose your place.',
      saving: 'Saving...',
      saved: 'Saved on this device',
      saveNow: 'Save now',
    },
    versionNotice:
      'The audit questions have been updated since you last saved. Your answers are kept. Please review them.',
    sectionsLabel: 'Audit sections',
    sectionsGroup: 'Sections A to F',
    sectionSelect: 'Section',
    sectionCount: '{done} of {total}',
    sectionSrPrefix: 'Section {key}:',
    sectionSrSuffix: 'answered',
    sectionOption: '{key}. {name} ({done} of {total})',
    stepStates: { done: 'Complete', current: 'Viewing' },
    evidenceHelp: {
      title: 'How sure are you? What the labels mean',
      intro:
        'Next to each answer you can say how you know it. That lets us show how firm each score is. There are no wrong choices.',
      verified: 'You have a document or record to back this up.',
      'institution-reported': 'This comes from your own team. We have not checked it.',
      estimate: 'Your best estimate. That is perfectly fine; it simply gives us less certainty.',
      judgement: 'Your professional view, without hard data behind it.',
      unknown:
        'You are not sure. We will not guess, and this area stays open until you can answer.',
    },
    sectionEyebrow: 'SECTION {key}',
    sectionProgress: 'Section progress',
    questionsLabel: 'Questions in this section',
    nav: {
      label: 'Section navigation',
      back: 'Back to Section {key}',
      next: 'Save and continue to Section {key}',
      seeReport: 'See my report',
    },
    pause: {
      label: 'Save and resume',
      title: 'Need a break?',
      body: 'Everything you have answered is saved on this device. Come back whenever you like and pick up exactly where you stopped.',
      exit: 'Save and exit',
      report: 'Open report',
    },
  },
  questionCard: {
    status: { answered: 'Answered', unknown: 'Not sure', todo: 'To do' },
    notSure: 'Not sure',
    notSureActive: 'Marked Not sure. Undo',
    unknownNote:
      'Saved as Not sure. No problem: we will leave this open rather than guess, and you can answer later to firm up your score.',
    todoHint: 'Pick an answer above, or choose Not sure if you would rather skip it.',
    choose: 'Choose one',
    yes: 'Yes',
    no: 'No',
    notAnswered: 'Not answered',
    evidenceHeading: 'How do you know this?',
    evidenceMissing: 'Choose how you know this. It tells us how firm to make the score.',
  },
  accounts,
  unlock,
  costCalc,
  pdfExport,
  reportPage,
  landing,
  advisor,
  agentStrategy,
  questions: {
    A1: {
      text: 'What type of institution are you?',
      help: 'Pick the closest match.',
      control: 'Institution type',
      options: {
        'public-university': { label: 'Public university' },
        'private-university': { label: 'Private university' },
        'liberal-arts-college': { label: 'Liberal arts college' },
        'pathway-or-college-provider': { label: 'Pathway or college provider' },
        other: { label: 'Other' },
      },
    },
    A2: {
      text: 'How many Vietnamese students do you enrol now?',
      help: 'This sets your stage.',
      options: {
        starting: { label: 'Starting', description: '0-5 students' },
        building: { label: 'Building', description: '6-15 students' },
        growing: { label: 'Growing', description: '16-30 students' },
        established: { label: 'Established', description: '31+ students' },
      },
    },
    A3: {
      text: 'Which levels can Vietnamese students join?',
      help: 'Choose all that apply.',
      options: {
        bachelor: { label: 'Bachelor' },
        master: { label: 'Master' },
        doctorate: { label: 'Doctorate' },
        pathway: { label: 'Pathway' },
        'short-courses': { label: 'Short courses' },
      },
    },
    A4: {
      text: 'Do you have an international office?',
      help: 'A named team, not one shared inbox.',
    },
    B1: {
      text: 'How many Vietnamese students enrolled this year?',
      help: 'Count current students from Vietnam.',
      control: 'Students enrolled (headcount)',
      unit: 'students',
      placeholder: 'e.g. 9',
    },
    B2: {
      text: 'How have applications from Vietnam changed?',
      help: 'Compare with two years ago.',
      options: {
        rising: { label: 'Rising', description: 'More than before' },
        flat: { label: 'Flat', description: 'About the same' },
        falling: { label: 'Falling', description: 'Fewer than before' },
      },
    },
    B3: {
      text: 'Where do most Vietnamese leads come from?',
      help: 'Choose the biggest source.',
      control: 'Main lead source',
      options: {
        agents: { label: 'Agents' },
        'your-website': { label: 'Your website' },
        'education-fairs': { label: 'Education fairs' },
        'alumni-and-referrals': { label: 'Alumni and referrals' },
        'social-media': { label: 'Social media' },
        'not-tracked': { label: 'Not tracked' },
      },
    },
    B4: {
      text: 'Do you track enquiry to enrolment?',
      help: 'From first message to first day.',
    },
    C1: {
      text: 'Which price band is your net annual cost?',
      help: 'After scholarships. Choose one band.',
      options: {
        'under-20k': { label: 'Under $20k' },
        '20-30k': { label: '$20-30k' },
        '30-40k': { label: '$30-40k' },
        '40-50k': { label: '$40-50k' },
        '50k-plus': { label: '$50k+' },
      },
    },
    C2: {
      text: 'How easy is it to win a scholarship?',
      help: 'For a typical Vietnamese applicant.',
      control: 'Scholarship attainability',
      options: {
        'most-applicants-receive-one': { label: 'Most applicants receive one' },
        'some-applicants-receive-one': { label: 'Some applicants receive one' },
        'few-applicants-receive-one': { label: 'Few applicants receive one' },
        'we-do-not-offer-scholarships': { label: 'We do not offer scholarships' },
      },
    },
    C3: {
      text: 'Which costs do you publish online?',
      help: 'Choose all that apply.',
      options: {
        tuition: { label: 'Tuition' },
        housing: { label: 'Housing' },
        'health-cover': { label: 'Health cover' },
        'visa-fees': { label: 'Visa fees' },
        'living-costs': { label: 'Living costs' },
      },
    },
    C4: {
      text: 'What is your average net cost per year?',
      help: 'Use a number you can defend.',
      control: 'Net cost per year',
      unit: 'USD',
      placeholder: '[YOUR PRICE]',
    },
    D1: {
      text: 'Do you have Vietnamese-language web pages?',
      help: 'Pages written for families, not only translated menus.',
    },
    D2: {
      text: 'How fast do you reply to enquiries?',
      help: 'Our target is 24 to 48 hours.',
      control: 'Typical reply time',
      options: {
        'within-24-hours': { label: 'Within 24 hours' },
        '24-48-hours': { label: '24-48 hours' },
        '2-5-days': { label: '2-5 days' },
        'more-than-5-days': { label: 'More than 5 days' },
      },
    },
    D3: {
      text: 'How many staff handle Vietnam enquiries?',
      help: 'Count part-time staff as fractions.',
      control: 'Staff (full-time equivalent)',
      unit: 'people',
      placeholder: 'e.g. 2',
    },
    D4: {
      text: 'Which channels do you use with families?',
      help: 'Choose all that apply.',
      options: {
        email: { label: 'Email' },
        zalo: { label: 'Zalo' },
        whatsapp: { label: 'WhatsApp' },
        facebook: { label: 'Facebook' },
        agents: { label: 'Agents' },
        webinars: { label: 'Webinars' },
      },
    },
    E1: {
      text: 'How many Vietnam alumni can speak with families?',
      help: 'Only people who agreed to be contacted.',
      options: {
        none: { label: 'None', description: 'No contacts yet' },
        '1-2': { label: '1-2', description: 'A small start' },
        '3-or-more': { label: '3 or more', description: 'A real network' },
      },
    },
    E2: {
      text: 'Do you run sessions for parents?',
      help: 'Online or in person.',
    },
    E3: {
      text: 'Which parent concerns do you address?',
      help: 'Choose all that apply.',
      options: {
        cost: { label: 'Cost' },
        safety: { label: 'Safety' },
        visa: { label: 'Visa' },
        'jobs-after-study': { label: 'Jobs after study' },
        housing: { label: 'Housing' },
      },
    },
    E4: {
      text: 'How often do you contact alumni?',
      help: 'In Vietnam.',
      control: 'Contact rhythm',
      options: {
        never: { label: 'Never' },
        'once-a-year': { label: 'Once a year' },
        'every-term': { label: 'Every term' },
        monthly: { label: 'Monthly' },
      },
    },
    F1: {
      text: 'What is your goal for Vietnam?',
      help: 'Over the next two years.',
      options: {
        'hold-steady': { label: 'Hold steady', description: 'Keep current numbers' },
        'grow-steadily': { label: 'Grow steadily', description: 'Add a few each year' },
        'grow-fast': { label: 'Grow fast', description: 'Double in two years' },
      },
    },
    F2: {
      text: 'How many Vietnamese students in three years?',
      help: 'A target, not a promise.',
      control: 'Target students',
      unit: 'students',
      placeholder: 'e.g. 25',
    },
    F3: {
      text: 'What matters most to you?',
      help: 'Choose up to three.',
      options: {
        volume: { label: 'Volume' },
        'good-fit-students': { label: 'Good-fit students' },
        diversity: { label: 'Diversity' },
        revenue: { label: 'Revenue' },
        reputation: { label: 'Reputation' },
      },
    },
    F4: {
      text: 'Open to a 6-month pilot with three agents?',
      help: 'Non-exclusive. Reviewed monthly.',
    },
  },
} as const;

type Paths<T, P extends string = ''> = {
  [K in keyof T & string]: T[K] extends string ? `${P}${K}` : Paths<T[K], `${P}${K}.`>;
}[keyof T & string];

export type CopyKey = Paths<typeof en>;

/** Replaces each "{name}" placeholder in a copy template with its value. */
export function fill(template: string, values: Readonly<Record<string, string | number>>): string {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.split(`{${key}}`).join(String(value)),
    template,
  );
}

export function t(key: CopyKey): string {
  return key
    .split('.')
    .reduce<unknown>((node, part) => (node as Record<string, unknown>)[part], en) as string;
}
