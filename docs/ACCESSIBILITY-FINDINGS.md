# Accessibility findings

Audit of motion and the interactive primitives (WCAG 2.2 AA), by reading the code and by running the built app with Playwright and axe-core at 390px and 1440px. This file lists what was **not** fixed, and why.

## Fixed in this pass (each has a test)

| Problem | Fix |
| --- | --- |
| `Breathe` looped forever (WCAG 2.2.2) | One 3s breath per time it scrolls into view. `src/design/motion-limits.test.ts` fails on any new endless animation outside the loading indicators. |
| Toasts closed after 4s even while being read (2.2.1), and each new toast re-announced the older ones | A toast stays while hovered or focused; the live region announces additions only. |
| Report cover title was navy on navy-deep (about 1.25:1) | The title takes the cover colour. |
| Success green was 4.45:1 on `navy-tint` and 4.29:1 on pastel blue | `--color-status-strong` darkened to `#1a7345`. `src/design/contrast.test.ts` checks every text token on the surfaces it is used on. |
| Agent buttons were named "Strengths and weaknesses of X", not containing the visible words in order (2.5.3) | The button is named by its visible text. The `caption` also lost its invalid `role="caption"`. |
| Cost calculator had two landmarks with the same name | The inner one is a plain `div`. |

## Not fixed

### Needs a product decision

- **Endless loading animations stay.** `KiteBob`, the busy-button kite (`anim-fly`), the button spinner and the skeleton pulse repeat until loading ends. They are loading status, which WCAG treats as essential, they only run while on screen and in a visible tab, and the global reduced-motion rule removes them. If the team wants a stricter reading, swap them for a static kite after 5s.
- **Authenticated flows could not be driven live.** `/quick-start`, `/first-read`, `/intake`, `/report` and `/unlock` redirect to sign-in without a session, so axe saw the sign-in page there. Those screens are covered by the Storybook axe run (`pnpm build-storybook && pnpm a11y`, 500 stories). Run axe against a signed-in session once the auth choice is made.

### Low risk, not confirmed in use

- Status text colours on tints they are not placed on: `status-concern` on pastel blue is 4.40:1, `status-caution` and `status-info` on `pastel-blue-deep` are 4.07 and 4.34. No screen does this today; do not add it without darkening the token.
- `--color-input-border` is 3.09:1 to 3.84:1 on the surfaces fields sit on (needs 3:1), but 2.99:1 on navy and 2.64:1 on `pastel-blue-deep`. Do not put a field on those.
- `BubblePopover`: Escape moves focus back to the "!" button even if focus has since moved elsewhere, and inside an `ArchSheet` the same Escape would also close the sheet (both listen on `document`). No screen nests them today.
- `Carousel`: Left and Right arrows are handled on the whole carousel, so a text field inside a slide would lose caret movement. The only slides today (`PilotPlan`) hold plain text.
- Radio inputs measure 24px, which meets 2.5.8, and sit inside a larger clickable card (`RadioCard`).
- Text over gradients or images (Home hero) was not measured pixel by pixel; axe cannot, and the design uses solid bands.

### Checked and fine

- No autoplay carousel. The Home intro lasts 2.5s with a Skip button and never runs under reduced motion. The scroll kite is driven by scrolling. The paper plane flies once.
- `ArchSheet`: focus moves in, Tab and Shift+Tab stay inside, Escape closes, focus returns to the button that opened it (checked in the built app at both widths). `StepTransition` hides the leaving copy with `inert` and `aria-hidden`; step changes are announced by `StepLabel` and `FlowShell`. `Tabs`, `Accordion`, `Select` follow the standard patterns. Tap targets of 44px or more on every primitive and every page measured.
- axe (WCAG 2.0 to 2.2 A and AA plus best practice) reports nothing else on the 12 routes at 390px and 1440px, with and without reduced motion.

### Tooling note

`git fetch origin` printed a lock error on `refs/remotes/origin/main` in this environment, so the branch was cut from the local `origin/main` (`6eead4b`). If `main` has moved, merge it before opening the pull request.
