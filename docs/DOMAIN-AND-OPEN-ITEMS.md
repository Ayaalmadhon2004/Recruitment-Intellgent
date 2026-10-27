# Domain and open items

## Entities (src/domain/types)
Question (id, section A-F, type, options, feeds[], quickStart), Answer (questionId, value, evidenceTag, confidence), EvidenceTag = Verified | Institution-reported | Estimate | Judgement | Unknown, Confidence = High | Medium | Low, ScoreArea (id, name, components), ScoreResult (see ARCHITECTURE), Stage (Starting | Building | ...; Building = 6-15 Vietnamese students), Audit (institution, answers, status, configVersion, entitlement), Recommendation (ranked by impact), AgentFactor (name, weight), PilotPlan, Forecast.

Score areas (each 0-100): Readiness, Competitiveness, Affordability and ROI, Digital Visibility, Trust Network, Community Influence. Plus School Fit (0-10) and Agent Attractiveness (0-10).

## Known facts you may put in config
- 40 questions in sections: A Institution info, B Current Vietnam performance, C Tuition/scholarships/affordability, D Recruitment infrastructure, E Parents/students/alumni, F Strategic objectives.
- Affordability weights (sum 100): net annual cost 30, scholarship attainability 15, cost transparency 10, graduate outcomes 20, academic/career value 15, financial-risk mitigation 10.
- Price bands: under $20k, $20-30k, $30-40k, $40-50k, $50k+.
- Digital Visibility funnel: 7 stages; response target 24-48h.
- Agent strategy: 6-month non-exclusive pilot, 3 agents, commission benchmark 10-15%. Forecast = qualified applications x offer rate x enrolment yield x visa/retention adjustment.
- Placeholder bands (not final): Strong 75+, Developing 55-74, Needs attention below 55.
- Agent selection factors (sample, accepted for now): 7 factors, weights 20/18/15/14/13/10/10.

## NOT known yet: never invent, use placeholders and `NotScorable`
1. Scoring formulas for Readiness, Competitiveness, Digital Visibility, Trust Network, Community Influence, School Fit, Agent Attractiveness, and how answers map to each.
2. The full structured list of the 40 questions (text, type, options, which score each feeds) and which 5 are Quick Start.
3. A worked sample audit with expected scores (needed to write real scoring tests).
4. Final band cut-offs.
5. Free vs locked line, unlock path, pricing.
6. Advisor channels (WhatsApp, email) and advisor name/photo.
7. Data hosting, retention, privacy policy, database and auth provider.
8. Whether live web research is part of the report (AI layer, later).
9. Brand assets: logo SVG, real photos, brand hex confirmation.

Sample data used in the design (always labelled "Sample data"): Northbridge University, stage Building, 28 of 40 answered (70%), Readiness 68, Competitiveness 54, Affordability 62, Digital Visibility 78, Trust Network 49, Community Influence not yet scorable, School Fit 7.0, Agent Attractiveness 5.5. These are design fixtures, not validated outputs.

## What the domain layer stubs (feature 1, prompt 04)
Everything below is a stand-in. Nothing here is a confirmed fact or formula.

| Item | Where | State | Replace when |
|---|---|---|---|
| Question list | `src/domain/config/questions.config.ts` | TEMPORARY: the 24 questions shown in the Intake design (4 per section A to F), not the 40. Every one has `temporary: true`. Text lives in `copy/en.ts` under `questions.<id>`. | Capstone confirms the 40 (unknown 2) |
| Which score each question feeds | `feeds` on every question | Empty `[]`. Unknown. NotScorable results list no missing ids until this is filled. | Capstone confirms the mapping (unknown 1, 2) |
| Quick Start questions | `quickStart` flag | TEMPORARY: `quickStart: true` on A1, B1, C1, D1, F1 (chosen because B1 decides the stage and the others span question types). The real 5 are unknown. | Capstone picks the 5 (unknown 2) |
| Option ids | question `options[].value` | Slug of the design label, for example `private-university`. Stored in answers. | Real option lists arrive |
| Stage source question | `stages.config.ts` `source` | TEMPORARY: `B1` (Vietnamese students enrolled this year). The design also has A2 as a stage picker; B1 was chosen because stage is defined by headcount. | Real question list arrives |
| Scoring formulas | `scoring.config.ts` `formulas` | `null` for all six areas and both gauges. `scoreArea` and `scoreGauge` return `NotScorable` with `reason: 'no-formula'`. | Capstone gives the formulas (unknown 1) |
| Affordability weighting | `scoring/affordability.ts` | Implemented: `sum(weight x component) / 100`. How answers become the six component scores, and how confidence is derived, are unknown, so the caller supplies both. | Mapping is confirmed (unknown 1) |
| Score bands | `scoring.config.ts` `bands` | PLACEHOLDER: Strong 75+, Developing 55-74, Needs attention below 55. `bandsStatus: 'placeholder'`. | Final cut-offs (unknown 4) |
| Agent factors | `agents.config.ts` | SAMPLE: 7 factors, weights 20/18/15/14/13/10/10, `factorsStatus: 'sample'`. Names taken from the AgentStrategy design. | Capstone confirms |
| Gauge bands | none | Gauges (0-10) have no bands. | If bands are wanted for gauges |
| Recommendation impact scale | `types/recommendation.ts` | Type only. `impact` is relative, larger first. No scale or ranking function. | Report feature (08) |
| Sample audit | `tests/fixtures/northbridge.ts` | `isSample: true`. 13 answers from the Intake design. Per-answer confidence follows the tag for the fixture only (verified high, institution-reported medium, estimate low). The design numbers (68, 54, 62, 78, 49, n/a, 7.0, 5.5; 28 of 40) are kept as display fixtures, not expected outputs. | A worked sample audit with expected scores (unknown 3) |
| Evidence tag to confidence | `evidence.config.ts` | PLACEHOLDER: verified high, institution-reported medium, estimate low, judgement low. The design says the tag "sets your confidence" but gives no mapping. `defaultTag: institution-reported` is given to answers collected where no tag is asked (Quick Start). `evidence.status: 'placeholder'`. | Capstone confirms how confidence is derived (unknown 1) |
| Free vs locked areas | `access.config.ts` | PLACEHOLDER: `lockedWhenFree: []`, so no area is hidden in the free preview. `access.status: 'placeholder'`. | Capstone confirms the free vs locked line (open item 5) |
| Config version | `config/version.ts` | `vri-config-0.1.0`. Stored with every audit. | Bump on any config change |
| Agent factor weights in the UI | `features/agent-strategy` | Shown with "Sample weights [TO BE CONFIRMED WITH CAPSTONE]" while `factorsStatus` is not `confirmed`. `weightedAgentScore` reads weights from the config passed in. | Capstone confirms the factors and weights |
| Sample agents and ratings | `tests/fixtures/agentStrategy.ts` | SAMPLE: Agent A, B, C and their 1 to 5 ratings from the AgentStrategy design. Not real. Shown with "Sample data - agents and ratings are not real". | Real agents and a rating source exist (who rates, and how, is unknown) |
| Sample forecast inputs | `tests/fixtures/agentStrategy.ts` | SAMPLE: 120 applications, 55% offer rate, 30% yield, 85% visa and retention. Shown with "Sample inputs - not a prediction". No benchmarks are supplied. | The institution enters its own numbers, or Capstone supplies benchmarks |
| Pilot month text | `copy/sections/agentStrategy.ts` | Titles and bodies for months 1 to 6 are from the design. The pilot numbers come from `agentsConfig.pilot`. | Capstone reviews the wording |
| Advisor channels on Agent Strategy | `tbc.config.ts` | WhatsApp, email and call details are `null`, so they show as to be confirmed, not as links. | Advisor channels confirmed (unknown 6) |
| Every unknown | `config/tbc.config.ts` | All `null`: formulas, 40 questions, Quick Start ids, sample audit, bands, free/locked line, unlock paths, pricing, advisor channels and photo, hosting, retention, privacy, database, auth, web research, brand assets, VND rate, report date. | Each is filled only when Capstone confirms it |
| Stored shape | `types/audit.ts` | `Audit` holds answers and `configVersion`. There is no field for a score. | n/a |
| ScoreDetail design | `src/features/report/components/ScoreDetail` | `ScoreDetail.dc.html` was NOT supplied. The view was built from the text of prompt 08 and the visual language of `Main.dc.html`. Check it against the real file when it arrives. Only Affordability shows components and weights (confirmed); every other area shows the TBC placeholder. Recommendations have no body text, so they render as plain titled rows. | `ScoreDetail.dc.html` is supplied |

## What the Full Intake stubs (feature 3)
| Item | Where | State | Replace when |
|---|---|---|---|
| Persistence | `features/intake/store` | `AnswerStore` interface (`load`, `save`) with a `localStorage` implementation (key `vri.intake.v1`). Stores `{ configVersion, answers, confirmedTagIds, sectionIndex }`, never scores. Shape is validated on load; invalid or foreign data is dropped. Status text says "Saved on this device". A saved audit from another config version keeps its answers and shows a notice. | Feature 5 (accounts) supplies a database-backed `AnswerStore` and passes it to `IntakePage`; no component changes |
| Evidence tag confirmation | `confirmedTagIds` in the stored audit | The domain `Answer` needs a tag, but the design wants the person to pick one. Until they do, the answer holds the config default tag (`evidence.defaultTag`) and the picker shows no selection with "Pick one tag". Picking one adds the question to `confirmedTagIds`. Marking Not sure removes it. Open: should an answer with an unconfirmed tag count towards confidence or completeness? Today completeness ignores tags. | Capstone confirms how tags and confidence relate (unknown 1) |
| Question totals | `questionsConfig.length` | Every count and the "THE n-QUESTION AUDIT" eyebrow come from config: 24 today, 40 when the real list lands. Nothing is hard-coded. | Real 40 questions (unknown 2) |
| Section names | `copy/en.ts` `sections` | From the brief (A to F). | Capstone confirms wording |
| Evidence help wording | `copy/en.ts` `intake.evidenceHelp` | Verified, Institution-reported, Estimate and Unknown come from the design. The Judgement line is an unconfirmed stand-in. | Capstone confirms |
| Report link | `/intake` page | "See my report" and "Open report" point to `/first-read` until the Report feature exists. "Save and exit" goes to `/` until the Dashboard exists. | Features 4 and 5 |
| Number questions | `QuestionCard` | A number cannot be cleared once entered (use Not sure). | Pattern change if wanted |
