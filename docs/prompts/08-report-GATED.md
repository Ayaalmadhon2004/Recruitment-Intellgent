GATED: needs the real scoring formulas. You can still build the structure now with fixture data and NotScorable for unknown areas, but do not claim scores are real.

Read CLAUDE.md, docs/ARCHITECTURE.md and docs/DOMAIN-AND-OPEN-ITEMS.md. Build Feature 4: Report in `src/features/report`, matching `design-reference/screens/Main.dc.html`, `ScoreDetail.dc.html`, `PrelimReport.dc.html`, `PdfPreview.dc.html` and mobile variants.

1. One `ReportModel` built from an Audit plus config (server side). One `ReportSection` component family with modes `interactive | preview | print`, reused by Feature 2 (preview) and Feature 10 (print). Refactor Feature 2's First Read to use it if it duplicated anything.
2. Interactive report: area tabs, accordion of evidence, carousel, radar, stage and next-steps, as in the design.
3. ScoreDetail: how the score is built (components and weights from config), evidence, gaps ("Missing evidence"), recommendations ranked by impact.
4. Locked areas show their locked state (entitlement comes in Feature 6; for now a boolean on the Audit).
5. NotScorable areas always explain what is missing and link to the question.

Tests: all three modes render the same model consistently; NotScorable paths; ranking order. Stories per mode and viewport.

Done when: the three modes share one implementation, `pnpm check` passes. Commit.
