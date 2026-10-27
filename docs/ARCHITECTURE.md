# Architecture

## Principle
Build component, then pattern, then feature, then page. Anything that can change after the client replies (questions, weights, bands, prices, copy) lives in config, not in code.

## Layers (imports go downward only)
```
app        routes only: each page composes one or more features
features   landing, quick-start, intake, report, accounts, cost-calc, agent-strategy, unlock, advisor, pdf-export
patterns   ScoreRing, ProgressBar, RadarChart, StatusBadge, EvidenceTag, ConfidenceMeter, NotScorableState,
           SampleDataBadge, TbcValue, StageCard, ScoreCard, ActionList, CtaBand, AdvisorCta, FlowShell
shell      SiteHeader, SiteFooter, PageContainer, SectionHeader
ui         Button, Card, Field, Select, RangeSlider, RadioCard, Tabs, Accordion, Carousel, Stepper, Reveal, Icon, PhotoBox, PaperFoldMark
design     tokens, motion
domain     types, config, scoring (pure functions), copy: no React, imported by features and (types only) by patterns
```

## Folders
```
src/
  design/  ui/  patterns/  shell/
  domain/  types/  config/  scoring/  copy/
  features/<name>/  components/  state/  api/  index.ts
  app/
tests/fixtures/northbridge.ts
```

## Dependency rules (enforced in CI with dependency-cruiser or eslint-plugin-boundaries)
| layer | may import | must not import |
|---|---|---|
| design | nothing | everything |
| ui | design | patterns, features, domain |
| patterns | ui, design, domain types only | features, app |
| shell | ui, design | features |
| domain | nothing (pure TypeScript) | any UI |
| features/x | ui, patterns, shell, domain, other features via index.ts | internals of other features |
| app | everything | n/a |

## Three structural duplicates found in the design (build once)
1. **Report** appears in Main (interactive), PrelimReport (free preview with locked areas) and PdfPreview (print). One `ReportSection` component with modes `interactive | preview | print`, fed by one `ReportModel`.
2. **Question** appears in QuickStart (5 questions) and Intake (40). One `QuestionCard`; the 5 are questions flagged `quickStart: true` in `questions.config`.
3. **Multi-step flows** QuickStart, Unlock, Advisor: steps, form, success. One `FlowShell`.

## Features (vertical slices) and build order
| # | Feature | Screens | Depends on | Done when |
|---|---|---|---|---|
| 0 | Foundation | none | none | tokens, shell, primitives in Storybook; boundaries enforced in CI |
| 1 | Domain core | none | 0 | questions config, scoring engine, Northbridge fixture with automated tests |
| 2 | Quick Start + First Read | QuickStart, PrelimReport | 0, 1 | 5 answers produce a stage, 3 readable areas, 3 locked areas |
| 3 | Full Intake | Intake | 1, 2 | 40 questions in sections A to F, saved progress, evidence tag per answer |
| 4 | Report | Main, ScoreDetail | 1, 3 | ReportSection in 3 modes; NotScorable areas render their state |
| 5 | Accounts + saved audits | SignIn, Dashboard | 0, 1 | save, resume, move Quick Start answers into an account |
| 6 | Unlock | Unlock | 4, 5 | locked areas open by entitlement; path and price from tbc config |
| 7 | Cost Calculator | CostCalc | 1, 4 | six weights from config feed Affordability |
| 8 | Agent Strategy | AgentStrategy | 1, 4 | factor matrix, 6-month pilot, forecast() |
| 9 | Advisor | Advisor | 0 | form plus contact channels from tbc config |
| 10 | PDF Export | PdfPreview | 4 | ReportSection in print mode |
| 11 | Landing | Landing | 0 | static marketing page |

## Data rules
- Store answers (value, evidence tag, confidence) and the `configVersion` used; compute scores on read.
- `ScoreResult = Scored { value, band, confidence } | NotScorable { missing: QuestionId[] }`.
- Logic lives on the server; the browser only renders `ScoreResult`.
