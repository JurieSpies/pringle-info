# The Shore — Visual Redesign of Overstrand Lifeline

**Date:** 2026-08-30
**Status:** Approved
**Scope:** Visual reskin + typography system. No functional changes.

## Purpose

Redesign the look and feel of the Overstrand Lifeline PWA so it feels polished
and hand-crafted rather than AI-generated. The interaction model, data, PWA
behaviour, offline support and deployment stay exactly as they are today.

The current app trips several known "AI tell" patterns: Inter + Space Grotesk
(the two most common AI faces), uniform rounded cards, a blur-glass sticky
header, and centred layout elements. Research sources:
[AI tells (Sailop)](https://sailop.com/blog/10-dead-giveaways-website-generated-by-ai),
[more AI tells (Publishd)](https://publishd.app/blog/make-ai-built-site-not-look-ai),
[calm tech / low-stimulus UI trend](https://www.intuitia.tech/blog/app-design-trends).

## Design language

Three typefaces doing three jobs. No gradients, no glassmorphism, no decorative
motion, no centred layouts, no uniform radius.

| Role | Face | Weights | Use |
|------|------|---------|-----|
| Display | Fraunces | 500/600/700 | Wordmark, headings, category & section titles, entry titles |
| Numerals | Space Mono | 400/700 | Every dialable phone number, counts, number pills, badges |
| Body | Instrument Sans | 400/500/600 | All body copy, labels, meta, buttons, search placeholder |

All three are SIL OFL — self-hosted in `fonts/` (like Space Grotesk today) so
the look survives offline. `index.html` swaps the Google Fonts link and the
`@font-face` in `tailwind.source.css`. Inter and Space Grotesk are removed.

**Numbers are the hero.** Every dialable number renders in Space Mono with
tabular figures, same size class (15px on cards, larger in lifeline). This is
both functional (aligned, unambiguous digits) and distinctive.

## Palette — "shore"

Light mode:

| Token | Value | Contrast (text on it) |
|-------|-------|------------------------|
| paper | `#F5F2EC` | canvas |
| card / surface | `#FFFFFF` | — |
| ink | `#26221B` | 14.16:1 on paper |
| ink-soft | `#4A453B` | 8.52:1 |
| ink-muted | `#6E685A` | 4.96:1 |
| ink-faint | `#A39B8B` | decorative only |
| primary (sage-teal) | `#2E6E62` | 5.96:1 on white |
| primary-dark | `#22544B` | 8.61:1 |
| primary-soft | `#E6EFEC` | teal-on-soft badge 5.09:1 |
| primary-light | `#7FBFB2` | teal on dark |
| hairline | `#E4DCCB` | warm divider (replaces `#e6e6e6`) |
| crisis | `#C1292E` | 5.79:1 white-on-crisis (unchanged) |
| crisis-dark | `#9E1E22` | unchanged |
| crisis-light | `#E8B4B0` | unchanged |

Dark mode (tuned, not inverted):

| Token | Value |
|-------|-------|
| bg | `#141A18` |
| card | `#1D2421` |
| ink | `#ECE9E2` (14.55:1) |
| muted | `#A9B8B1` (8.55:1) |
| primary-light | `#7FBFB2` (8.4:1 on bg) |
| hairline | `#27332F` |

Crisis red unchanged in both modes. Amber alert rows and green WhatsApp rows
keep their existing hues and roles. All ratios verified ≥ WCAG AA.

## Look & feel changes (structure kept)

- **Header** — solid warm-paper band (no `backdrop-blur`). Wordmark in Fraunces
  at 700. The eyebrow line ("Overstrand · Emergency & Community") in
  Instrument Sans. Menu/theme buttons keep circular icon style with hairline.
- **Lifeline section** — unchanged structure (single collapsible red section),
  but service names in Fraunces, numbers in Space Mono, call buttons keep red.
- **Search & area row** — 10px radius inputs, teal focus ring, hairline border.
  "My area" label in Instrument Sans caps; pin icon teal.
- **Category accordions** — serif titles, teal mono number pills
  (primary-soft bg), mono entry counts, hairline dividers, 12px radius.
- **Cards** — white on paper, serif entry titles, meta in muted sans, phone
  numbers in Space Mono 15px, dial rows and call buttons red, email/nav rows
  teal, WhatsApp green — all roles unchanged.
- **Tools & Guides** — checklist (teal accents, mono counts, progress bar teal),
  first aid (red badges/headers), helplines (red badge). Type re-tokenized only.
- **Install banner, toast, update banner** — re-tokenized, behaviour unchanged.
- **Icons** — all inline SVG unchanged; no emoji anywhere.

## How it works — unchanged

- Interaction model, accordions, search, favourites, My Area, tools panel.
- `data.js` schema and content unchanged.
- PWA: manifest, service worker, offline, update banner, install flow unchanged.
- Deployment: `.github/workflows/deploy-pages.yml` unchanged; fonts now ship the
  three new files (same `fonts/` dir).

## Files touched

- `index.html` — Google Fonts link, class tokens throughout, `<style>` tweaks
  (e.g. remove `backdrop-blur`), font-family references.
- `tailwind.config.js` — replace `paper`/`ink`/`primary`/`hairline` tokens;
  add `font-display` = Fraunces, `font-num` = Space Mono, `font-sans` =
  Instrument Sans.
- `tailwind.source.css` — new `@font-face` blocks (Fraunces, Space Mono,
  Instrument Sans).
- `tailwind.css` — rebuild via `bun run build`.
- `fonts/` — add Fraunces / Space Mono / Instrument Sans woff2; remove Space
  Grotesk.
- `sw.js` — precache the three new font files; bump VERSION.
- `tests/smoke.ts` — repair stale lifeline/menu assertions that reference the
  pre-collapsible-refactor app (pre-existing failure; unrelated to the reskin).
- `DESIGN.md` — update the Local Adaptations section (new palette + type) and
  the "The app follows the Notion system" framing.
- `README.md` — Files table (font note) if it names Space Grotesk.
- `AGENTS.md` — update the design-system user-preference bullet.
- `pringle-info.md` — update the Design system section (palette + type).

## Verification

- `bun run build` rebuilds Tailwind cleanly.
- `bun run test` (Playwright smoke) passes with dev server running.
- Manual check on a phone viewport: no horizontal scroll, thumb targets,
  legible small text; both light and dark modes.
- Contrast ratios above are the acceptance bar for every new token pairing.