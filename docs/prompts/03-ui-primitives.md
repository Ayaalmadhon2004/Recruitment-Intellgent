Read CLAUDE.md and docs/ARCHITECTURE.md. Build the `ui` layer, matching `design-reference/` (find each pattern in the screens: Main, Landing, QuickStart, Intake, CostCalc, Unlock, Advisor).

Components: Button (primary crimson pill, secondary, sizes, loading, disabled), Card (radius, optional hover lift), Field (real label, hint, error), Select (native with label), RangeSlider (native range with label and visible value), RadioCard (radio group semantics), Tabs, Accordion, Carousel (slides + dots, keyboard and swipe, no autoplay), Stepper (red node and line, current/done/upcoming), Reveal (entrance animation wrapper), Icon (inline stroke SVG set used by the screens), PhotoBox (image with alt, or labelled placeholder "[PHOTO: ... To be supplied by Capstone]"), PaperFoldMark (the 4-polygon mark from Main; polygons 6,66 54,4 54,50 / 6,66 54,50 32,94 / 58,4 94,52 36,92 / 58,4 36,92 58,56).

Rules: ARIA patterns and keyboard support are built here once (Tabs arrow keys, Accordion aria-expanded, Carousel labelled controls); tap targets at least 44px; visible focus ring; all copy by prop (no hard-coded text); only design tokens.

Each component: a story with all states, plus a Testing Library test for its keyboard and ARIA behaviour (Tabs, Accordion, Carousel, RadioCard, Stepper at minimum). Run the Storybook a11y checks.

Done when: every component has stories and tests, a11y addon shows no violations, `pnpm check` passes. Commit.
