GATED: do not start until the client confirms (a) database and hosting, (b) privacy policy and data retention, (c) the free vs locked line, the unlock path and pricing. Until then only the interfaces may exist.

Read CLAUDE.md and docs/ARCHITECTURE.md. Build Feature 5 (Accounts + saved audits: SignIn, Dashboard) and Feature 6 (Unlock) in `src/features/accounts` and `src/features/unlock`, matching the design screens and mobile variants.

- Implement `AnswerStore` and `AuditRepository` against the confirmed database; store answers plus `configVersion`, never final scores. Scores are recomputed on read.
- Auth with the confirmed provider; on sign-in move the anonymous Quick Start answers into the account.
- Dashboard: list of saved audits with stage and progress, empty state "No audits yet".
- Unlock: `entitlement` model independent of payment method; the path and price come from `tbc.config` and render through TbcValue until confirmed. Locked areas open when the entitlement says so.
- Privacy: collect the minimum, follow the confirmed retention policy, no secrets in the client.

Tests: persistence round trip, config-version recompute, entitlement gating, anonymous-to-account migration.

Done when: `pnpm check` passes and the open-items doc is updated. Commit.
