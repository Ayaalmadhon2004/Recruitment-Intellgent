# Decisions

## 1. Tokens: CSS Modules over CSS variables (not Tailwind)

**Decision.** Components are styled with CSS Modules. All design tokens are CSS variables defined once in `src/design`. Components read them with `var(--token)`.

**Why.**

- Rule 9 says no hard-coded colours, radii or font sizes outside `src/design`. With plain CSS files this is one grep or lint check on `*.module.css` and `*.tsx`.
- No second mapping layer (Tailwind theme to variables) that can drift from the tokens.
- No runtime cost, works with Server Components and Storybook with no extra config.
- The approved prototypes are plain CSS with inline values, so porting them to CSS Modules is a direct translation.

**Consequence.** Do not add Tailwind. If a utility is needed twice, it becomes a ui component or a token.

## 2. Layer rules enforced by dependency-cruiser

**Decision.** `.dependency-cruiser.cjs` encodes the table in `docs/ARCHITECTURE.md`. `pnpm boundaries` runs in `pnpm check` and in CI.

Rules: design imports nothing; ui imports design only; patterns import ui, design and domain types only; shell imports ui and design; domain imports no UI and no React/Next; features import other features only through `index.ts`; features never import `app`; no circular imports.

**Proven.** A temporary import of `patterns` from `ui`, of a feature's internals from another feature, and of `react` from `domain` each failed the check, then were removed.

## 3. TypeScript pinned to 5.9

dependency-cruiser does not support TypeScript 7 yet (it needs the compiler API, supported range `>=2 <7`). Without a supported compiler it silently skips `.ts` files and the boundary check would pass on nothing. Revisit when dependency-cruiser supports TypeScript 7.

## 4. Temporary design assets

`design-reference/assets` is copied to `public/temp-assets/`: the logo and two stock photos (graduate, campus). These are placeholders. The logo is a low-resolution PNG. Replace with the supplied SVG logo and real photos once Capstone confirms them (open item 9 in `docs/DOMAIN-AND-OPEN-ITEMS.md`). Until then photos are labelled temporary.
