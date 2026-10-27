Read CLAUDE.md and docs/ARCHITECTURE.md. Build Feature 9 (Advisor), Feature 10 (PDF Export) and Feature 11 (Landing), matching `design-reference/screens/Advisor.dc.html`, `PdfPreview.dc.html`, `Landing.dc.html` and mobile variants.

- Advisor: FlowShell with the form and success state. Contact channels (WhatsApp, email) and the advisor name/photo come from `tbc.config` through TbcValue/PhotoBox placeholders until confirmed. Submission goes through a server route with validation; the destination (email service, CRM) is an open item, so use an interface and a stub.
- PDF Export: use ReportSection in `print` mode. Options screen (what to include). Generate a real PDF server side only after confirming the approach in docs/DECISIONS.md (propose options, then pick the simplest that keeps fonts and layout).
- Landing: static marketing page composed from patterns, using only content from the design; unknown facts stay placeholders.

Tests: form validation, success state, print mode snapshot. Stories per viewport.

Done when: `pnpm check` passes. Commit.
