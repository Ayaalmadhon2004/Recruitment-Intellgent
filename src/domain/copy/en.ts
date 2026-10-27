/** English UI copy. Components never hard-code text; they receive these values by key. */
export const en = {
  brand: {
    productName: 'Vietnam Recruitment Intelligence',
    logoAlt: 'Capstone Education',
    footerLine: 'Vietnam Recruitment Intelligence by Capstone Education',
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
  },
  header: {
    cta: 'Start the audit',
  },
  foundation: {
    eyebrow: 'FOUNDATION',
    title: 'Design tokens and shell',
  },
  status: {
    notScorable: 'Not yet scorable',
    tbc: '[TO BE CONFIRMED WITH CAPSTONE]',
    sample: 'Sample data - illustrative only',
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
    'institution-reported': 'Institution-reported',
    estimate: 'Estimate',
    judgement: 'Judgement',
    unknown: 'Unknown',
  },
  confidence: {
    label: 'Confidence',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    none: 'None yet',
  },
  scoreCard: {
    outOf: 'out of 100',
  },
  notScorable: {
    reasons: {
      'no-formula': 'The scoring rules for this area are not confirmed yet. We will not guess.',
      'missing-answers': 'We need more answers before we can score this. We will not guess.',
      'invalid-answer': 'An answer cannot be used. Please check it.',
    },
    missingHeading: 'Still needed',
  },
  stageStates: {
    done: 'Passed',
    current: 'You are here',
    upcoming: 'Ahead',
  },
  firstRead: {
    eyebrow: 'YOUR FREE FIRST READ',
    title: 'Your first read',
    lead: 'Here is where you stand from the questions you have answered so far.',
    stageChip: 'Stage: {stage}',
    preliminaryChip: 'Preliminary result',
    progressLabel: 'Quick Start progress',
    progressText: '{answered} of {total} questions answered',
    stageEyebrow: 'YOUR STAGE',
    stageHeadline: 'You are {stage}',
    stageListLabel: 'Recruitment stages',
    scoredEyebrow: 'PREVIEW SCORES',
    scoredTitle: 'Areas we can read already',
    scoredNone: 'No area can be scored yet. We do not show a score we cannot back up.',
    lockedEyebrow: 'STILL LOCKED',
    lockedTitle: 'Areas that need more answers',
    ringAria: '{name} score {value} out of 100',
    ctaEyebrow: 'NEXT STEP',
    ctaTitle: 'Finish the audit to see every score.',
    ctaBody: 'Your answers so far are kept.',
    ctaContinue: 'Complete the full audit',
    ctaChange: 'Change my answers',
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

export function t(key: CopyKey): string {
  let node: unknown = en;
  for (const part of key.split('.')) {
    node = (node as Record<string, unknown>)[part];
  }
  return node as string;
}
