# VRI: Vietnam Recruitment Intelligence (Capstone Education)

A web app that audits how ready a foreign university is to recruit students in Vietnam. English UI, light theme, desktop and mobile equal. Brand: Capstone Education. This file is the project memory: read it first in every session.

## Read before coding
- `docs/ARCHITECTURE.md`: layers, folders, dependency rules, features, build order. This is the law.
- `docs/DOMAIN-AND-OPEN-ITEMS.md`: entities, config files, and what is NOT yet known.
- `design-reference/`: the approved UI (13 screens, desktop and mobile). Visual source of truth. Files are `.dc.html` prototypes: read the HTML/CSS for exact values; `{{...}}` are template holes, not real syntax. See `design-reference/README.md` to preview them locally. Do not copy the prototype structure; rebuild as React components per the architecture.

## Non-negotiable rules
1. **Build bottom-up, feature by feature, never page by page.** Order: design tokens, ui, patterns, shell, domain, then features, then app routes. Pages only compose.
2. **Dependencies point down only** (enforced by lint, see ARCHITECTURE.md). `domain/` imports nothing from React or UI. Features import other features only through their `index.ts`.
3. **No duplication.** If something appears in two places it becomes a component or a config value. Check `ui/` and `patterns/` before writing markup.
4. **Never invent data.** No made-up scoring formulas, Vietnam statistics, prices, contact details or institution facts. Unknown values live in `domain/config/tbc.config.ts` as `null`; the UI renders them through `<TbcValue>` as `[TO BE CONFIRMED WITH CAPSTONE]`. A score that cannot be computed is the type `NotScorable`, rendered as "Not yet scorable". Never `null`, `0` or a guess.
5. **Changeable facts are config, not code.** Weights, bands, stages, question lists, agent factors, copy. Components receive them as props or read them from `domain/`.
6. **Sample data is always labelled.** Anything from `fixtures/northbridge` shows `<SampleDataBadge>`.
7. **Scoring runs server-side only.** Scores are computed from stored answers plus a config version; store answers and `configVersion`, not final scores.
8. **Accessibility is built into primitives once:** WCAG 2.2 AA, tap targets at least 44px, visible focus ring, status = colour + word + icon (never colour alone), text contrast at least 4.5:1, `prefers-reduced-motion` respected, real `<label>`, real `<button>`/`<a>`.
9. **Tokens only.** No hard-coded colours, radii or font sizes outside `src/design`.
10. All UI text comes from `domain/copy/en.ts` by key (no strings hard-coded in components, so another language can be added later).

## Stack
Next.js (App Router) + TypeScript strict + pnpm. CSS variables for tokens (CSS Modules or Tailwind mapped to the tokens; pick one in prompt 01 and stay consistent). Vitest + Testing Library. Storybook for every ui/pattern component and each state. Backend: Next.js route handlers on Node; database and auth choice is an open item (see docs). Scoring lives in `src/domain/scoring` as pure functions so it runs anywhere.

## Definition of done (every task)
`pnpm check` passes (typecheck, lint, boundaries, tests). New components have a Storybook story covering normal, empty, NotScorable and TBC states where relevant. Checked at 390px and 1440px widths with no horizontal scroll. Small commits with clear messages.

## Working style
Plan first (short), then implement. If something needed is unknown, do not guess: add it to the open items list, use a clearly marked placeholder, and continue. Ask me only when blocked.

## Git workflow (strict, applies to Claude and to every sub-agent)
- **Every feature starts from the latest `main`**: `git fetch origin && git checkout -b feat/<name> origin/main`. Never branch from another feature branch, and never from an old local `main`.
- **One feature per branch, one pull request per branch, and the pull request always targets `main`.** Never open a PR whose base is another feature branch (no stacked PRs).
- **If a feature needs code from a feature that is not merged yet, stop.** Do not branch from the unmerged branch and do not copy its commits. Say so, and wait until that PR is merged into `main`, then branch from `main`. (A pull request may be opened early as a draft against `main` only if the description names the PR it waits for.)
- **When another PR merges while yours is open**, bring it in with `git merge origin/main` into your branch (no rebase, no force-push once a PR is open), re-run `pnpm check`, then push.
- **Sub-agents** use the same rules: each works on its own branch cut from the latest `main` (or from the branch of the feature it is part of, merged back into that feature branch by the lead before the PR), never pushes to `main`, and never opens a PR itself.
- **Merging into `main` happens only through a reviewed pull request.** Nothing is pushed straight to `main`.
- **Commits are authored by the repository owner (Aya almadhon) only.** Do not add `Co-Authored-By` or any Claude/AI attribution to commits or pull request text.
- **One logical change per commit**, each with a clear, conventional message (`feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`).
- **Do not commit local tooling folders** (`.claude/`, `storybook-static/`, `.next/`, `coverage/`).
