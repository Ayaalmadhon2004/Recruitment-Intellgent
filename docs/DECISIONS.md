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

## 5. PDF export: print-CSS route and the browser's print dialog

**Decision.** The PDF is made from a dedicated route, `/report/pdf`, that renders `ReportSection` in `print` mode on A4 pages styled with `@page` and `@media print`. The "Download PDF" button calls `window.print()`; the person chooses "Save as PDF". No PDF library and no server-side renderer.

**Why.**

- It needs no new infrastructure. Hosting, runtime limits and a headless browser are still unconfirmed (open item 7), so a server renderer (Puppeteer or Playwright on a route handler) would depend on facts we do not have.
- One `ReportSection` serves interactive, preview and print (ARCHITECTURE, duplicate 1). A PDF library would need a second layout of the same report, which breaks the no-duplication rule.
- Scores still come from the server: the print route reads the same report model as `/report`.
- Text stays real text (selectable, accessible, searchable) and tokens apply as they do on screen.

**Trade-offs.**

- The person controls the final step (browser dialog, margins, headers and footers). Output varies a little between browsers. We fix page size and margins with `@page`, and hide chrome with `@media print`.
- No file name is set by the app; the browser suggests one from the page title.
- Cannot be emailed or generated in the background. If Capstone needs that, a server renderer can be added later behind the same route without changing `ReportSection`.
- The design's "Generating your PDF" progress bar and "PDF ready" file name imply a server job. With the print dialog there is no job to track, so those states are not built. Noted as a change from the design.

**Options.** Included sections are page state, not stored: the printed output is the same page, with the options hidden. Language is English only; Vietnamese stays disabled and marked to be confirmed. Institution logo upload is not built (upload storage is unconfirmed); the toggle shows the design's placeholder box.

## 6. Accounts: abstract service now, development implementation, provider later

**Decision.** Feature 5 (SignIn, Dashboard) is built against interfaces in `src/features/accounts`, not against a provider. The database and the auth provider are still unknown (open item 7), so none is chosen or installed.

- `AccountService` = `AuthGateway` (request a sign-in link, complete sign-in, current user, sign out) + `AuditRepository` (list, get, save audits for the signed-in user). Every method is async, because a real provider is.
- The only implementation is `createDevAccountService`, labelled DEVELOPMENT in code and docs. It keeps users, audits and the session in this browser's `localStorage`. No email is sent, nothing is verified, and anything stored there is not private from the person at the keyboard. It returns the sign-in token to the page so the flow can be walked through; a real provider never does. The screens show a "Development accounts" notice while this service is in use.
- A real provider is a drop-in: implement `AccountService`, pass it as `runtime.service`. No component changes.

**What is stored.** An audit is its answers, the evidence tags the person confirmed, the Intake section index, the `configVersion` and an `updatedAt`. Never a score, a stage or a status: those are computed on read (rule 7).

**Working copy.** The Intake and the Report already read and write one `AnswerStore` on the device. That stays the working copy. The account holds the synced copy:

- Resume (`Update audit`, `View report`) copies the account audit into the device store and remembers its id (`vri.accounts.active.v1`). The Intake and Report run unchanged.
- While an account audit is active, the Intake saves through a syncing store: write to the device first (never lost), then `saveAudit` to the account, one write at a time.
- "Start new audit" empties the working copy and forgets the id; the first save creates the account audit.
- Sign-in moves anonymous work in (`adoptLocalAudit`): the device Intake answers, or if there are none the Quick Start answers, become a new account audit once; the Quick Start tab copy is cleared (moved, not copied). If an account audit is already active, nothing is adopted twice.
- Sign-out clears the working copy only when it belongs to an account audit (it is synced and could belong to someone else on a shared device). Anonymous work stays.

**Dashboard facts.** Progress (answered of total) is counting, done in the browser from config. The stage is a computed result, so cards ask `POST /api/audit-summaries` with answers and `configVersion`; the server returns the stage (or NotScorable). A card whose `configVersion` differs from the current one says so.

**Not decided here.** Entitlement (Unlock, feature 6), an institution name (no question asks for it; cards read "Untitled audit"), account deletion, retention, email delivery and link lifetime (`signInLinkExpiry` is a `TbcValue`). All listed in `docs/DOMAIN-AND-OPEN-ITEMS.md`.

**Trade-off.** Two copies of the answers (device and account) can disagree if an account audit is edited on another device while this device holds a stale working copy. Resume always refreshes from the account, and each save overwrites the account copy (last write wins). Conflict handling needs a real provider's versioning.
