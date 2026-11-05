# Motion

One motion system for the whole app: **wind and kite**. Everything lifts, settles or glides. No bouncing, no flashing, no parallax. No animation library: CSS, small hooks and SVG cover it.

## Tokens

Source of truth: `src/design/motion.ts` (numbers for JS, including `plane` and `windStreaks`) and the `--dur-*`, `--ease-*`, `--stagger*`, `--enter-distance` variables in `src/design/tokens.css`. `src/design/motion.test.ts` fails if the two drift apart. No magic numbers elsewhere.

| Token | Value | Use |
| --- | --- | --- |
| `micro` | 150ms | hover, press, focus ring, check marks |
| `base` | 280ms | entrances, step swaps, toasts, modal backdrop and close |
| `large` | 600ms | bars, rings, lines, modal arch rising |
| `hero` | up to 2000ms | the Home intro only (it ends at 2.5s with its line stagger) |
| `lift` | `cubic-bezier(.2,.7,.2,1)` | every entrance |
| `settle` | `cubic-bezier(.3,1.25,.5,1)` | the kite only (one light overshoot) |
| `linear` | `linear` | dashed-line drawing only |
| `plane.flight` | 900ms | the paper plane's whole flight, button to off screen |
| `plane.navigateAt` | 380ms | the next page opens this far into the flight |
| `plane.size`, `plane.sizeMobile` | 96px, 72px (below 480px) | plane width at its biggest |
| `windStreaks` | 5 streaks | `delay`, `offset`, `length`, `opacity` of each trailing streak (50ms to 290ms behind the plane) |
| `--z-plane` | 80 | the plane overlay sits above everything, including the header |
| stagger | 60ms, max 6 items (3 below 480px) | the rest appear together |
| rise | 12px (8px below 480px), opacity 0 to 1 | entrances |

## Rules

- Animate only `transform`, `opacity` and `stroke-dashoffset`. Bars scale (`scaleX`), kites glide with `transform`, rings and lines draw with dash offset. No animated width, height, top or left, so no layout shift.
- Scroll entrances run once. One hero motion per screen.
- `prefers-reduced-motion`: no movement. The global rule in `motion.css` removes animations and transitions, and every primitive reads `useReducedMotion` and renders its final state (rings and counters still show their value, the scroll kite is not rendered, the intro is a still kite plus the headline).
- Continuous loops (`KiteBob`, `Breathe`) run only while on screen and the tab is visible (`useActive`).
- Focus rings only fade in (`focus-in`), they are never animated away. Keyboard and focus behaviour is unchanged.
- Scroll handlers are passive and throttled with `requestAnimationFrame`; the scroll kite reads geometry once per layout, never in the loop.
- The paper plane animates only `transform` and `opacity`, on a fixed overlay (`--z-plane`) that never takes clicks and is `aria-hidden`, so it cannot shift layout. Under `prefers-reduced-motion` there is no plane: the page opens at once.
- The plane flies only for internal links (`href` starts with `/`, not `//`) and only on plain clicks: left button, no Ctrl, Meta, Shift or Alt, no `target` other than this tab, no `download`. Everything else keeps normal browser behaviour. A second press during a flight is ignored.
- Phones (390px): shorter rise, at most 3 staggered items.

## Primitives (`src/ui`)

| Primitive | Does |
| --- | --- |
| `useReducedMotion`, `prefersReducedMotion` | the one reduced-motion check |
| `useInView`, `useActive`, `useRevealPhase` | once-only visibility, on-screen-and-tab-visible, the scroll-entrance state machine |
| `Reveal` | scroll-triggered fade-rise, `index` staggers |
| `CountUp` | counts to a value (on change, or `from` on first sight); reserves its final width |
| `DrawLine` | draws a (dashed) SVG line with a dash-offset mask; controlled by `progress` for scroll lines |
| `KiteBob` | the loading kite (replaces spinners) |
| `Breathe` | slow opacity glow around a pill (3s) |
| `StepTransition` | old step leaves up, new rises in; back reverses; the old one is out of flow, inert and hidden from assistive tech |
| `SwapText` | label or number cross-fade with a 6px slide (used by `StepLabel`) |
| `SaveDot` | autosave dot: pastel, then navy with a check for 1.5s |
| `PaperPlaneProvider`, `usePaperPlane` (`PaperPlane`) | wrap the app once with the router's `navigate`; `usePaperPlane()` returns `flyTo(href, origin?)`, or `undefined` without a provider. A red and blue folded plane with five wind streaks flies from the pressed button up and out past the top-right corner; the next page opens 380ms in and arrives under it. `Button` calls it for internal links, so pages never wire it themselves. `isInternalHref` is the link test |

Shared classes in `src/design/motion.css`: `anim-up`, `anim-stagger`, `anim-grow`, `anim-ring`, `anim-fade`, `anim-pop-in`, `anim-step-next/back`, `anim-exit-next/back`, `anim-text-in/out`, `anim-check-in`, `anim-cell-in`, `anim-dot-in`, `anim-fly`, `anim-ring-pulse`, `anim-kite-in`, `anim-after-build`, `hover-underline`. Sections use these; new keyframes belong here or inside a `ui` primitive, not in a section.

## Per section

| Section | Motion |
| --- | --- |
| Global | page content rises on each route (`(site)/template.tsx`); pills lift 2px, darken, press to .98; focus ring fades in; nav dot grows 0 to full and the active label goes blue to red; toasts drop in, stay 4s, slide up out, max 2; skeletons pulse in pastel; spinners are `KiteBob`; every plain click on an internal button link sends the paper plane (900ms flight, page opens at 380ms, instant under reduced motion) |
| Home | intro: kite spins in, wings unfold, headline block written line by line (2.5s, Skip button, once per session, never under reduced motion); wave divider static; "What you get" rises staggered and its figures count in; scroll kite follows a path that draws as you scroll and leans up to 8 degrees with direction; how-it-works kites build one after another with captions after; final CTA breathes (the old kite lift on start is gone; the Start button now sends the paper plane, see Global) |
| Sign-in | active step circle pulses a ring once; connecting line scales as steps advance; send button shows a kite flying across, then a check; sent message fades in; no shake on errors; privacy note static |
| Audit | step label cross-fades; questions and sections leave up and arrive from below (back reverses); chosen pills fill navy with a check; "how sure" pills appear staggered; progress kite glides with `settle` and dips when a section completes; autosave dot; first read counts scores up (800ms) |
| My Report | diamond fills by section from the centre (80ms each), a new answer pops alone; score detail counts up (500ms) and its ring draws; gauge dots fill left to right |
| Agent Strategy | rows rise, bars fill (600ms, staggered by column), score rings draw; row hover tint; arch modal fades and blurs in, rises 24px, closes faster, bottom sheet on phones; pilot kite follows the pointer exactly while dragging and settles to the nearest month on release (arrow keys settle too), month text cross-fades; forecast number counts (300ms), red ring eases |
| Price band | line draws 600ms, end dots pop, expected dot lands last with `settle`; bubble fades with a 6px rise |
| Talk to a person | advisors rise staggered and lift on hover; step 1 to 2 uses the same directional arrival; bubble scale .92 to 1 |
| Footer, Dashboard | footer links draw an underline on hover, no entrance; audit cards rise in a small stagger |

## Layout stability

`main` is at least one screen tall (`base.css`) and the header holds a slot for the sign-in link, so swapping a loading state for the page, or the session resolving, never moves anything in view. `pnpm e2e:motion` checks CLS is 0 on Home, Audit, Report and Agent Strategy, that reduced motion leaves nothing at opacity 0 or still animating, that a plain click on an internal button link navigates with CLS 0 through the plane flight, and that under reduced motion the page opens at once with no plane animation running.

## Not done, and why

- Wave divider: static by choice (the brief allowed it; it costs nothing and avoids a permanent animation).
- First-read "kite lifts": that screen has no kite, so only the count-up was added.
- Advisor "role line slides in on hover": not done, because hiding the role until hover would hide it on touch screens and from keyboard users. The person lifts on hover and focus instead.
- Question exit animation is not used in the FlowShell panel (Quick Start and Unlock) or the contact steps: they hold focus refs that a leaving copy would steal. They get the directional arrival only.
- Input focus ring "grows": only the shared fade-in was added; changing the ring size would touch every field.
