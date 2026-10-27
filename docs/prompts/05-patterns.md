Read CLAUDE.md and docs/ARCHITECTURE.md. Build the `patterns` layer: domain-aware display components that take `domain` types as props. Match `design-reference/` (ScoreRing and radar in Main; progress bars in Intake/QuickStart/CostCalc; badges in ScoreDetail).

Components: ScoreRing (draws the ring; the number is real HTML text over the SVG, never SVG text driven by data), ProgressBar, RadarChart (axes labelled by HTML legend, accessible table fallback), StatusBadge (strong/caution/concern/info: colour + word + icon), EvidenceTag (5 tags), ConfidenceMeter, NotScorableState (shows "Not yet scorable" and what is missing), SampleDataBadge, TbcValue (renders `[TO BE CONFIRMED WITH CAPSTONE]` when the value is null, otherwise the value), StageCard, ScoreCard (area, ScoreResult, band; handles both Scored and NotScorable through one code path), ActionList (ranked next steps), CtaBand, AdvisorCta, FlowShell (steps, current step, back/next, success state; generic, no feature knowledge).

Rules: props are domain types (ScoreResult etc.) so a `NotScorable` can never render as a number; status is never colour alone; charts have text alternatives; everything animated respects reduced motion.

Stories for every component with states: Scored in each band, NotScorable, TBC null, sample badge on. Tests: ScoreCard renders NotScorable correctly, TbcValue null vs value, StatusBadge always contains text and icon.

Done when: stories and tests exist, a11y clean, `pnpm check` passes. Commit.
