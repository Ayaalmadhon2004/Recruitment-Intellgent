# Status

A snapshot for a new contributor or a new chat session. It says where the project stands; the rules live elsewhere (see "Where the rules live"). If this page and the code disagree, the code wins: fix this page.

VRI (Vietnam Recruitment Intelligence) is a web app by Capstone Education that audits how ready a foreign university is to recruit students in Vietnam.

## What is merged on `main`

Built bottom-up, in the order the architecture requires (merge order, oldest first):

1. Scaffold: Next.js App Router, TypeScript strict, pnpm, lint, tests, CI (PR 1).
2. Design tokens and the shell (header, footer, page frame) (PR 2).
3. `ui/` primitives with Storybook stories (PR 3).
4. Domain core: types, config files, scoring helpers, copy, the Northbridge sample fixture (PR 4).
5. `patterns/`: QuestionCard, ProgressBar, score cards, FlowShell and others (PR 5).
6. Quick Start: five-question flow and the First Read result (PR 6).
7. Report section building blocks in `src/features/report` (PRs 12 and 15).
8. Git workflow rule added to `CLAUDE.md` (PR 13).
9. Full Intake: 24 temporary questions in sections A to F, evidence tags, save on this device (PR 14).
10. Cost Calculator: pure cost functions, a Switch primitive, and the `/cost-calc` page (PR 17).

Shared code: `src/features/questions` (answer state and question views, used by Quick Start and Intake), `src/features/shared-labels` (label bundles for score patterns).

Not built yet: the report pages, accounts and a database, the dashboard, the advisor and pricing flows. Scores are only computable where `scoring.config.ts` has a formula, and today none do, so scores show "Not yet scorable" unless a sample fixture is labelled "Sample data".

## Routes

Pages (`src/app/**/page.tsx`):

- `/` home, the landing page (no separate `/landing` route)
- `/quick-start` five-question flow
- `/first-read` the First Read result
- `/intake` the full audit
- `/cost-calc` the cost calculator
- `/report` the report
- `/report/[area]` score detail for one area (for example `/report/affordability`)

Wiring: paths live in `src/domain/config/routes.config.ts`; header and footer nav labels in `en.nav.items`. The `(site)` layout renders the one `<main>`, so pages and features must not render their own.

Route handlers (`route.ts`):

- `POST /api/first-read` computes the First Read on the server from stored answers and the config version
- `/api/report` report data, computed on the server

Run `find src/app -name page.tsx -o -name route.ts` to refresh this list.

## How to run

- `pnpm install`
- `pnpm dev` starts the app on http://localhost:3000
- `pnpm check` runs typecheck, lint, token check, boundaries and tests. It must pass before every commit.
- `pnpm storybook` starts Storybook on http://localhost:6006
- `pnpm build-storybook && pnpm a11y` builds Storybook and runs axe on every story (needs Chromium: `npx playwright install chromium`)

CI runs `check` and, as a separate job, the accessibility run.

## Where the rules live

- `CLAUDE.md`: project memory and the non-negotiable rules. Read first.
- `docs/ARCHITECTURE.md`: layers, folders, dependency rules, build order.
- `docs/DOMAIN-AND-OPEN-ITEMS.md`: entities, config files, every stub and what is unknown.
- `docs/DECISIONS.md`: why choices were made (CSS Modules, layer enforcement, TypeScript 5.9, temporary assets).
- `design-reference/`: the approved UI prototypes.

## Git workflow

- Every change goes on a new branch from the latest `main` (for example `feat/<name>`, `chore/<name>`) and a pull request to `main`. No stacked branches, no pushes to `main`.
- Commits are authored by the repository owner only, one logical change each, conventional messages (`feat:`, `fix:`, `chore:`, `docs:`), with no co-author or AI attribution lines.

For open pull requests, check GitHub; they change too often to list here.

## Not known yet (gated by Capstone)

Copied from `docs/DOMAIN-AND-OPEN-ITEMS.md`. Never invent these; use `tbc.config.ts` placeholders and `NotScorable`.

1. Scoring formulas for Readiness, Competitiveness, Digital Visibility, Trust Network, Community Influence, School Fit, Agent Attractiveness, and how answers map to each.
2. The full structured list of the 40 questions (text, type, options, which score each feeds) and which 5 are Quick Start.
3. A worked sample audit with expected scores (needed to write real scoring tests).
4. Final band cut-offs.
5. Free vs locked line, unlock path, pricing.
6. Advisor channels (WhatsApp, email) and advisor name and photo.
7. Data hosting, retention, privacy policy, database and auth provider.
8. Whether live web research is part of the report (AI layer, later).
9. Brand assets: logo SVG, real photos, brand hex confirmation.
