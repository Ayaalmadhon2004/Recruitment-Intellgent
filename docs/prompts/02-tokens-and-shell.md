Read CLAUDE.md and docs/ARCHITECTURE.md. Implement the `design` and `shell` layers, matching the approved UI in `design-reference/screens/Main.dc.html` (open its CSS block and header/footer markup for exact values; also read `design-reference/DESIGN-SPEC.md`).

1. `src/design`: tokens as CSS variables (page bg #FAF5EC, card #FFFFFF, navy-deep #0D2447, navy #1E3A5F, crimson #A41034, crimson-dark #8F0728, text #333333, text-secondary #525252, lines #E8DFCF/#E3D8C4/#EFE7D8/#DCDCDC, input border #818285, status strong #1E7A4C, caution #8A5A00, concern #B4470C, info #2F5FA8), Poppins 400/500/600/700 via next/font, type scale (H1 40/48 and 30/38 on phone, H2 22/30, H3 18/26, body 16/26, small 14/22, caption 13, eyebrow 13/600 with .08em tracking in crimson), radii (pills 999px, cards 20 to 32px), spacing, focus ring.
2. Motion: the entrance, ring-draw, bar-grow, pulse, float, hover-lift keyframes from Main, wrapped so they respect `prefers-reduced-motion`. Provide a `Reveal` ui component later in prompt 03; here only the keyframes and utility classes.
3. `src/shell`: SiteHeader (logo, product name, nav items passed as props, crimson pill CTA), SiteFooter, PageContainer (max 1200px, 20px side padding under 760px), SectionHeader (eyebrow + H2). All text from `domain/copy/en.ts` keys (create the file with the keys you need).
4. Storybook stories for each, desktop (1440) and mobile (390) viewports.
5. A temporary `app/page.tsx` showing header, a SectionHeader and footer, only to eyeball it. Compare against the design at both widths and fix differences.

Done when: tokens exist only in `src/design`, no hard-coded colours elsewhere (add a lint or grep check), stories render, no horizontal scroll at 390px, `pnpm check` passes. Commit.
