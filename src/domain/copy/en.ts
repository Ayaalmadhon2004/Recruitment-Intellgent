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
