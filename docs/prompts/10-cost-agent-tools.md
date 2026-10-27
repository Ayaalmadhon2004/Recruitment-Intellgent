Read CLAUDE.md, docs/ARCHITECTURE.md and docs/DOMAIN-AND-OPEN-ITEMS.md. Build Feature 7 (Cost Calculator) and Feature 8 (Agent Strategy) in `src/features/cost-calc` and `src/features/agent-strategy`, matching `design-reference/screens/CostCalc.dc.html`, `AgentStrategy.dc.html` and mobile variants.

Cost Calculator: inputs by slider and select (RangeSlider, Select), net annual cost and price-band placement from config price bands, peer comparison using clearly labelled sample data, the six Affordability weights from config feeding the result. Pure calculation lives in `domain/scoring`; the UI only renders.

Agent Strategy: factor matrix (7 factors, weights from `agents.config`, rate 1 to 5 per agent), selected agents, 6-month non-exclusive pilot timeline with 3 agents, forecast using `forecast()` (qualified applications x offer rate x enrolment yield x visa/retention adjustment). Any figure not supplied by the user or config is a TbcValue, never a made-up benchmark.

Tests: calculation edge cases, weight changes in config change results without code edits (write a test that proves it), step navigation. Stories for each tool.

Done when: `pnpm check` passes. Commit.
