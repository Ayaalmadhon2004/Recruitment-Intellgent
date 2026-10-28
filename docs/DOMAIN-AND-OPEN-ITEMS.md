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
| Cost calculator peers | `tests/fixtures/costSample.ts` | SAMPLE: Peer A/B/C at $27k/$36k/$44k from the design, plus the starting numbers ($34,000 tuition, $9,000 living, $6,000 scholarship). Shown with `SampleDataBadge` and "peer values are not real". The component takes peers as a prop; with none, the chart is hidden. | Real peer benchmarks are supplied, or the chart is dropped |
| VND equivalent | `features/cost-calc` | STUB: rendered through `TbcValue` as `[TO BE CONFIRMED WITH CAPSTONE]`. `tbc.config` `vndExchangeRate` is `null`; no rate is used in any sum and no conversion exists. | Capstone confirms the rate; add a pure conversion in `domain/scoring` |
| Affordability from the calculator | `features/cost-calc` | NOT COMPUTED: the page lists the six weights from config but produces no Affordability score. How answers become the six component scores is unknown; the mapping line is a `TbcValue`. | Mapping is confirmed (unknown 1) |
| Every unknown | `config/tbc.config.ts` | All `null`: formulas, 40 questions, Quick Start ids, sample audit, bands, free/locked line, unlock paths, pricing, advisor channels and photo, hosting, retention, privacy, database, auth, web research, brand assets, VND rate, report date. | Each is filled only when Capstone confirms it |
| Advisor request sink | `features/advisor/api/sink.ts` | STUB: `stubAdvisorRequestSink` accepts a validated request and does nothing: no email, no CRM, no storage, no logging. Requests are NOT delivered anywhere yet. | Capstone picks the destination (email service or CRM) |
| Advisor channels | `tbc.config.ts` `advisorWhatsapp`, `advisorEmail`, `advisorCallDetails` | `null`. Each channel card shows `[... TO BE CONFIRMED WITH CAPSTONE]` through `TbcValue`. | Capstone confirms the contact details (unknown 6) |
| Advisor name, photo, reply time | `tbc.config.ts` `advisorName`, `advisorPhotoUrl`, `advisorReplyTime` | `null`. Shown as `[ADVISOR NAME]`, `[ADVISOR PHOTO]` and `[TO BE CONFIRMED WITH CAPSTONE]`; the success step 3 timing reads `[TIMING TO BE CONFIRMED WITH CAPSTONE]`. | Capstone confirms (unknown 6) |
| Advisor form limits | `features/advisor/validate.ts` `limits` | PLACEHOLDER: name 100, institution 150, contact 254, message 1000 characters; phone 6 to 15 digits. Chosen as sane defaults, not Capstone facts. | Capstone or privacy review |
| Advisor abuse protection | `app/api/advisor-request` | NONE: no rate limiting, no CAPTCHA, no honeypot. Only validation and a 16 KB body cap. | Decided together with the sink and hosting (unknown 7) |
| Advisor "Back to my report" | `AdvisorRequest` prop `backHref` | Defaults to `/` until the report route exists. | Report route is wired |
| Stored shape | `types/audit.ts` | `Audit` holds answers and `configVersion`. There is no field for a score. | n/a |
| Landing: full report price | `tbc.config.ts` `pricing`, shown by `features/landing` FreeOrFull | `null`. Renders `[PRICING TO BE CONFIRMED WITH CAPSTONE]` through `TbcValue`. | Pricing is confirmed (unknown 5) |
| Landing: privacy policy | `tbc.config.ts` `privacyPolicyUrl`, shown by the landing privacy strip | `null`. Renders `[PRIVACY POLICY TO BE CONFIRMED WITH CAPSTONE]`; becomes a link once set. | Privacy policy exists (unknown 7) |
| Landing: sample illustrations | `features/landing` Hero chip (Readiness 68 of 100) and the three "What you get" cards (score 78, stage step 2 of 4, 2 of 3 steps done) | SAMPLE: design illustrations, labelled "Sample data". Not outputs of the scoring engine. | Real previews are chosen |
| Landing: photo | `public/temp-assets/temp-graduate.jpg` in the hero | TEMPORARY: alt text says so. | Real photos supplied (unknown 9) |
| Landing: claims | `domain/copy/sections/landing.ts` ("about 3 minutes", 5 / 40 questions, free and full row lists) | Design content, not validated. The free/full line is not confirmed. | Free vs locked line is confirmed (unknown 5) |
| ScoreDetail design | `src/features/report/components/ScoreDetail` | `ScoreDetail.dc.html` was NOT supplied. The view was built from the text of prompt 08 and the visual language of `Main.dc.html`. Check it against the real file when it arrives. Only Affordability shows components and weights (confirmed); every other area shows the TBC placeholder. Recommendations have no body text, so they render as plain titled rows. | `ScoreDetail.dc.html` is supplied |

## What the Full Intake stubs (feature 3)
| Item | Where | State | Replace when |
|---|---|---|---|
| Persistence | `features/intake/store` | `AnswerStore` interface (`load`, `save`) with a `localStorage` implementation (key `vri.intake.v1`). Stores `{ configVersion, answers, confirmedTagIds, sectionIndex }`, never scores. Shape is validated on load; invalid or foreign data is dropped. Status text says "Saved on this device". A saved audit from another config version keeps its answers and shows a notice. | Done for the development service: `AccountIntake` (feature 5) passes a syncing `AnswerStore` that also saves to the account. A real provider needs no change here (see "What Accounts stubs") |
| Evidence tag confirmation | `confirmedTagIds` in the stored audit | The domain `Answer` needs a tag, but the design wants the person to pick one. Until they do, the answer holds the config default tag (`evidence.defaultTag`) and the picker shows no selection with "Pick one tag". Picking one adds the question to `confirmedTagIds`. Marking Not sure removes it. Open: should an answer with an unconfirmed tag count towards confidence or completeness? Today completeness ignores tags. | Capstone confirms how tags and confidence relate (unknown 1) |
| Question totals | `questionsConfig.length` | Every count and the "THE n-QUESTION AUDIT" eyebrow come from config: 24 today, 40 when the real list lands. Nothing is hard-coded. | Real 40 questions (unknown 2) |
| Section names | `copy/en.ts` `sections` | From the brief (A to F). | Capstone confirms wording |
| Evidence help wording | `copy/en.ts` `intake.evidenceHelp` | Verified, Institution-reported, Estimate and Unknown come from the design. The Judgement line is an unconfirmed stand-in. | Capstone confirms |
| Report link | `/intake` page | "See my report" and "Open report" point to `/report`. "Save and exit" goes to `/dashboard` (feature 5). | n/a |
| Number questions | `QuestionCard` | A number cannot be cleared once entered (use Not sure). | Pattern change if wanted |

## What the Report pages stub (feature 4, pages)
| Item | Where | State | Replace when |
|---|---|---|---|
| Institution name | `copy/en.ts` `reportPage.institutionName`, `loadStoredAudit` | PLACEHOLDER "Your institution". The Intake and Quick Start do not ask for a name, so the report shows this neutral label as its heading. Saved audits hold `institutionName: null` and the Dashboard says "Untitled audit". | A name question is added, or Accounts hold a profile |
| Entitlement | `loadStoredAudit` in `features/intake/store/load-audit.ts` | Still `free` there; the Report's `loadDeviceAudit` overrides it with the development entitlement (see "What Unlock stubs"). | A real unlock path (open item 5) |
| Audit status | `deriveAuditStatus` | `complete` only when every configured question has an answer or a Not sure mark, otherwise `in-progress`. Our own rule, not a confirmed one. | Capstone defines when an audit is finished |
| Audit id | `LOCAL_AUDIT_ID` | Constant `local-audit`: the Report reads the one working copy on the device. Account audits have their own ids (feature 5) but the Report does not use them; resuming an audit copies it into the working copy. | Report loads by audit id |
| Quick Start fallback | `features/report/storedAudit.ts` | The report uses the Quick Start tab answers only when the Intake store holds none. The two are never merged. Quick Start answers are stored without a config version, so they take the current one. | Quick Start answers move into the same store |
| Report links | `ReportPage`, `ScoreDetailPage` | "Answer this question", "Change answers" and "Complete the audit" all go to `/intake` (no per-question anchor yet). No PDF link: `/report/pdf` does not exist. | Feature 11 (PDF); Intake question anchors |
| First Read | `features/quick-start` | Still uses `FirstReadView` and `/api/first-read`. `ReportSection` preview differs in the page title (institution name, not "Your first read") and in the progress meaning (answered of all audit questions, not of the 5 Quick Start questions). | Capstone confirms the First Read design, or a Quick Start flavour of the report model is added |
| Number questions | `QuestionCard` | Emptying a number field calls the optional `onClear`; Quick Start and Intake use it to remove the stored answer (and the Intake confirmed tag). | n/a |

## What PDF Export stubs (feature 10)
| Item | Where | State | Replace when |
|---|---|---|---|
| PDF method | `/report/pdf`, `docs/DECISIONS.md` 5 | The browser print window ("Save as PDF"). No server renderer, so no generating progress and no file name from the app. | Hosting is confirmed (open item 7) and Capstone wants emailed or background PDFs |
| Report date | `tbc.config.ts` `reportDate` | `null`, so the cover shows `[TO BE CONFIRMED WITH CAPSTONE]`. | Capstone confirms where the date comes from |
| Institution logo | `tbc.config.ts` `pdfInstitutionLogoUpload` | `null`. The switch shows a dashed placeholder; no upload exists. | Upload storage is confirmed |
| Vietnamese | language select | Disabled, marked to be confirmed. | Capstone confirms a Vietnamese version |
| Affordability breakdown | `PrintAffordability` | Lists the six confirmed weights only. How answers feed each component is a `TbcValue`. | Mapping is confirmed (unknown 1) |
| Next steps | `NextSteps` print | Empty until recommendation content exists, so the toggle prints nothing. | Report recommendations are confirmed |
| Cover details | PdfPreview design | The design's "Language" and "Sections included" lines on the cover are not drawn; the count is in the options panel. | If wanted |

## What Accounts + saved audits stubs (feature 5)
Everything below is a stand-in. Decision 6 in `docs/DECISIONS.md` explains the shape. The database and the auth provider are unknown (open item 7): none is chosen or installed.

| Item | Where | State | Replace when |
|---|---|---|---|
| Account service | `features/accounts/service/types.ts` | Interfaces only: `AuthGateway` (request link, complete sign-in, current user, sign out) and `AuditRepository` (list, get, save). All async. | A provider is chosen: implement `AccountService`, pass it as `runtime.service` |
| Development service | `features/accounts/service/dev-service.ts`, `tbc.config.ts` `database`, `authProvider` | DEVELOPMENT ONLY. Users, audits and the session live in this browser's `localStorage` (key `vri.accounts.dev.v1`). No email is sent, nothing is verified, anyone at the keyboard can read it, and it does not sync between devices. Screens show a "Development accounts" notice while it is used (`runtime.isDevelopment`). | Database and auth provider are confirmed (unknown 7) |
| Sign-in token in the browser | `SignInLinkResult.developmentToken`, `LinkSent` | DEVELOPMENT ONLY. The development service returns the token and the page shows an "Open the sign-in link" button in its place. A real provider must never return it. | A real provider sends the link by email and a callback route completes sign-in |
| Sign-in method | `SignInPage` | Email one-time link, no password, taken from the design. Not a confirmed product decision. | Capstone and the provider choice |
| Link lifetime | `tbc.config.ts` `signInLinkExpiry` | `null`, so the inbox step reads "expires in [LINK LIFETIME TO BE CONFIRMED WITH CAPSTONE]". The design said 15 minutes; that is a provider fact we do not have. | Provider is chosen |
| Resend wait | `accounts.config.ts` `resendCooldownSeconds` | PLACEHOLDER 30 seconds from the design, enforced in the page only. | A real provider rate limit exists |
| Email check | `features/accounts/email.ts` | Shape check only (`a@b.c`, no spaces), as in the design. The provider verifies for real. | Provider is chosen |
| What is stored | `SavedAudit` | `institutionName`, the `StoredAudit` (answers, confirmed tag ids, section index, `configVersion`) and `updatedAt`. No score, stage, status or entitlement. | n/a |
| Working copy and sync | `working-copy.ts`, `AccountIntake` | Our own design (decision 6): the device store stays the working copy; the account holds a synced copy; each Intake save goes to the device first, then to the account (one at a time, last write wins). Two devices editing the same audit can overwrite each other. A failed account sync is silent: the Intake still says "Saved on this device". | A provider with versioning; decide how sync errors are shown |
| Adoption on sign-in | `adoptLocalAudit` | Runs when the Dashboard loads while signed in. Device Intake answers win, else the Quick Start answers; moved once (the Quick Start tab copy is cleared); never merged. Our own rule. | Capstone confirms how anonymous work should join an account |
| Sign-out clearing | `signOutAndClear` | Clears the device copy only when it belongs to an account audit (shared devices). Anonymous work stays. Our own rule. | Retention policy is confirmed (unknown 7) |
| Institution name | `SavedAudit.institutionName` | `null`. No question asks for it, so cards read "Untitled audit" and several audits look alike. No rename. | A name question is added |
| Audit status and progress | `features/accounts/model.ts` | Derived on read: complete when every configured question has an answer or a Not sure mark (same rule as `deriveAuditStatus`). Question totals come from config (24 today, not the design's 40). | Capstone defines when an audit is finished |
| Stage on cards | `POST /api/audit-summaries` | Computed on the server from posted answers with the CURRENT config (`pickStage`), whatever version the audit was saved under. A card saved under another version says so. If the server cannot be reached the card says "Stage: unavailable right now". The route is stateless and unauthenticated: it stores nothing but has no rate limiting. | Hosting and abuse protection are decided with the sink (unknown 7) |
| Sample audits | `features/accounts/fixtures.ts` | SAMPLE: the three Northbridge cards from the design (names, dates), used by stories and tests, shown with the Sample data badge. Never shown in the app. | n/a |
| No deletion, rename or export | Dashboard | Not built. No way to delete an audit or an account. | Retention and privacy policy (unknown 7) |
| Privacy wording | `copy/sections/accounts.ts` | "Your answers stay private to your account" and "Only you can see them" are design wording. They are not true of the development service, which is why its notice is shown. The design's "unless you share a report" is dropped: sharing does not exist. | Real provider and privacy policy |
| Design differences | Sign in, Dashboard | Not built, on purpose: the "Preview state" switch (Sign in) and the "Show empty state" toggle (Dashboard), which are design tooling. Built to match: an invalid email shows the "Problem." banner (the field gets the red border and `aria-invalid`, no second message). Still different: the step indicator is the shared `Stepper` (larger, with a state word under each step, so state is never colour alone, rule 8) instead of the design's small dot row. The nav is the shared site header, so the design's per-page header links differ: "Sample report" (no sample report route), "Start the audit" and "New audit" buttons, and "Sign out" in the Dashboard header (it is in the privacy strip, where the design also has it). The empty state's "See a sample report" button is replaced by the Quick Start. A signed-out Dashboard shows a sign-in prompt instead of redirecting. "My audits" is in the shared nav for everyone. | If the design is revised |
| Photo | Sign in | TEMPORARY `temp-graduate.jpg`, labelled in its alt text. | Real photos (unknown 9) |

## What Unlock stubs (feature 6)
Everything below is a stand-in. Decision 7 in `docs/DECISIONS.md` explains the shape. The free vs locked line, the unlock path(s), the price and the timing are unknown (open item 5). No payment integration, price, currency, contact or provider exists in the code.

| Item | Where | State | Replace when |
|---|---|---|---|
| Entitlement service | `features/unlock/service/types.ts` | Interface only: `getEntitlement(auditKey)`, `requestUnlock({ auditKey, pathId })`, both async. No `pending` outcome exists; a payment or advisor path will need one. | A path is chosen: implement `EntitlementService`, pass it as `runtime.service` |
| Development service | `features/unlock/service/dev-service.ts` | DEVELOPMENT ONLY. Grants an unlock at once and keeps it in this browser's `localStorage` (`vri.unlock.dev.v1`) keyed by audit. No payment, no check; anyone at the keyboard can unlock or edit it. The screen shows a "Development unlock" notice (`runtime.isDevelopment`). | A real unlock path exists |
| Server trusts the browser | `features/report/storedAudit.ts` `loadDeviceAudit`, `POST /api/report` | MUST NOT SHIP. The Report posts the audit with the entitlement read from the device and the server believes it, so a free user can claim `unlocked`. There is no server store to check against. The server does hide locked areas for a `free` audit (no result, evidence or gaps are sent), but only as far as it trusts that claim. | Server-side entitlement store keyed by audit id and user (needs open item 7) |
| Free vs locked line | `access.config.ts` `lockedWhenFree` | `[]` (PLACEHOLDER), so nothing is hidden today and the locked-area UI is only exercised by tests and stories. `tbc.config.ts` `freeVsLockedLine` is `null` and shown as to be confirmed on the screen. | Capstone confirms the line |
| Free and Full example lists | `unlock.config.ts` `exampleSplit`, copy `unlock.split.items` | PLACEHOLDER: the design's example lists (four free, five full, including "Full PDF export"). Labelled as an example on the screen. They are not the same thing as `lockedWhenFree` (areas). | The line is confirmed |
| Unlock options | `tbc.config.ts` `unlockPaths`, `unlock.config.ts` `placeholderPaths`, `features/unlock/paths.ts` | `unlockPaths` is `null`, so the screen shows the design's three selectable placeholder options "[UNLOCK PATH n: TO BE CONFIRMED WITH CAPSTONE]". Choosing one and confirming still unlocks in the development service. Icons on the options are neutral and decorative. | Capstone confirms the paths (typed as `UnlockPath`: id, label, note) |
| Price and timing | `tbc.config.ts` `pricing`, `unlockTiming` | `null`. The Confirm step shows only "Report" and "Unlock option", as in the design; it claims no price or timing, so no `TbcValue` row is needed there. `pricing` is still shown (as to be confirmed) on the Landing and the Report's unlock prompt. `unlockTiming` is unused for now. | Capstone confirms; add rows back if the design asks |
| PDF export is not gated | `/report/pdf` | The design lists "Full PDF export" as full-only, but `lockedWhenFree` holds areas, not features. The PDF page prints the model the server builds, so locked areas are hidden in it, but the page itself is open to everyone. | Capstone says whether the PDF is a locked feature |
| Unlock before sign-in | `features/unlock/deviceAudit.ts` | The entitlement is keyed by the active account audit id, else `local-audit`. Adopting anonymous work into an account creates a new audit id, so an unlock made before signing in does not carry over (the audit reads free again). | A real entitlement store moves with the audit |
| Entitlement not on the Dashboard | accounts feature | Cards do not show whether an audit is unlocked. | If wanted |
| Locked areas in other views | Report | Locked areas show a lock, the word "Locked" and a link in the preview, the interactive tabs and the score detail page; they are left out of print and of the radar (the radar is hidden while any area is locked). | Design review |
| Design differences | Unlock | Not built, on purpose: the "Preview state" switch (Locked / Choose / Confirm / Unlocked). It is prototype tooling that jumps between states the real flow reaches by itself, and jumping to Unlocked would fake an entitlement. Also not built: "Start over" on the done state. In the prototype it only resets local state; here the unlock is stored, so a reset would show "locked" while the service says unlocked, and removing an entitlement is server logic . Built to match: the three-step stepper (Choose, Confirm, Done) stays above the done state (`FlowShell` `finalStep`); the Confirm step has only the Report and Unlock option rows. Still different: the page header (nav) is the shared site header. "Five full sections and the complete PDF" became "Every item marked Locked above opens up" (no count claimed). The peek's "[FULL SECTION CONTENT APPEARS HERE]" became a link to the report. Institution name is the neutral "Your institution" (as on the Report); the design's "Northbridge University" appears only in stories, with the Sample data badge. | If the design is revised |
| First Read | `FirstReadPage` | The "Unlock full report" action shows only while the audit is free (the route `app/(site)/first-read/FirstReadRoute.tsx` reads the device entitlement and passes `unlockHref`; it shows nothing until the entitlement is read). The First Read's "STILL LOCKED" cards are areas that need more answers, not entitlement locks. | Capstone confirms the First Read design |
| Empty state | `UnlockPage` | With no answers on the device there is nothing to unlock: the lock card points to the Quick Start. Our own rule (not in the design). | Capstone confirms |

