Read CLAUDE.md, docs/ARCHITECTURE.md and docs/DOMAIN-AND-OPEN-ITEMS.md. Build Feature 2: Quick Start and First Read as one vertical slice in `src/features/quick-start`, matching `design-reference/screens/QuickStart.dc.html` and `PrelimReport.dc.html` (and their .mobile variants).

Flow: user answers the 5 Quick Start questions (the questions flagged `quickStart` in config; use the 5 shown in the design and mark them TEMPORARY in config until the client confirms) with one shared `QuestionCard` (create it in `patterns` if absent) and FlowShell, then sees the First Read: stage, the areas that can already be read (Scored), the areas that need more answers (locked/NotScorable), and a clear CTA to continue the full audit.

Requirements:
- Answers kept in client state only (no account yet); structure them as domain `Answer[]` so Feature 5 can persist them later.
- Stage and area results come ONLY from `domain/scoring` through a server route handler (`app/api/first-read`); the browser renders `ScoreResult`. Areas with no formula render NotScorable, not a number.
- Everything labelled with SampleDataBadge when using fixture data.
- Mobile and desktop equal; keyboard-only completion works; focus moves sensibly between steps.
- Pages in `app/` only compose the feature: `app/quick-start/page.tsx` and `app/first-read/page.tsx`.

Tests: the flow end to end with Testing Library (answer 5, see stage), the route handler, NotScorable rendering. Stories for QuickStart steps and First Read in both viewports.

Done when: the slice works end to end, no duplicated markup versus ui/patterns, `pnpm check` passes. Commit.
