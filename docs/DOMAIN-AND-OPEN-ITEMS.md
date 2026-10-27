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
