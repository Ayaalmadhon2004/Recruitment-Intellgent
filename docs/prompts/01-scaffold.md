Read CLAUDE.md and docs/ARCHITECTURE.md fully, then set up the project skeleton. Do NOT build any features or screens yet.

Plan briefly, then do:
1. Next.js (App Router) + TypeScript with `strict`, `noUncheckedIndexedAccess`, pnpm. Path aliases per layer: `@/design`, `@/ui`, `@/patterns`, `@/shell`, `@/domain`, `@/features`.
2. Create the empty folder structure from ARCHITECTURE.md, each folder with an `index.ts` where it makes sense.
3. ESLint + Prettier. Vitest + Testing Library. Storybook configured with a11y addon.
4. Enforce the dependency rules in the "Dependency rules" table with dependency-cruiser or eslint-plugin-boundaries. Prove it works: add a temporary violating import, show the failure, then remove it. Also forbid features importing another feature's internals (only its `index.ts`).
5. Decide how tokens are consumed (CSS Modules or Tailwind mapped to CSS variables). Record the choice and reason in a new `docs/DECISIONS.md`.
6. A `pnpm check` script running typecheck, lint, boundaries and tests. Add a minimal CI workflow that runs it.
7. Copy `design-reference/assets` to `public/temp-assets/` and note in DECISIONS.md that these are temporary photos/logo to be replaced.

Done when: `pnpm check` passes, `pnpm storybook` runs, the boundary rule demonstrably fails on a bad import, and the folder structure matches ARCHITECTURE.md. Commit.
