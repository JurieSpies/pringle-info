# DOX framework

- DOX is highly performant AGENTS.md hierarchy installed here
- Agent must follow DOX instructions across any edits

## Core Contract

- AGENTS.md files are binding work contracts for their subtrees
- Work products, source materials, instructions, records, assets, and durable docs must stay understandable from the nearest applicable AGENTS.md plus every parent AGENTS.md above it

## Read Before Editing

1. Read the root AGENTS.md
2. Identify every file or folder you expect to touch
3. Walk from the repository root to each target path
4. Read every AGENTS.md found along each route
5. If a parent AGENTS.md lists a child AGENTS.md whose scope contains the path, read that child and continue from there
6. Use the nearest AGENTS.md as the local contract and parent docs for repo-wide rules
7. If docs conflict, the closer doc controls local work details, but no child doc may weaken DOX

Do not rely on memory. Re-read the applicable DOX chain in the current session before editing.

## Update After Editing

Every meaningful change requires a DOX pass before the task is done.

Update the closest owning AGENTS.md when a change affects:

- purpose, scope, ownership, or responsibilities
- durable structure, contracts, workflows, or operating rules
- required inputs, outputs, permissions, constraints, side effects, or artifacts
- user preferences about behavior, communication, process, organization, or quality
- AGENTS.md creation, deletion, move, rename, or index contents

Update parent docs when parent-level structure, ownership, workflow, or child index changes. Update child docs when parent changes alter local rules. Remove stale or contradictory text immediately. Small edits that do not change behavior or contracts may leave docs unchanged, but the DOX pass still must happen.

## Hierarchy

- Root AGENTS.md is the DOX rail: project-wide instructions, global preferences, durable workflow rules, and the top-level Child DOX Index
- Child AGENTS.md files own domain-specific instructions and their own Child DOX Index
- Each parent explains what its direct children cover and what stays owned by the parent
- The closer a doc is to the work, the more specific and practical it must be

## Child Doc Shape

- Create a child AGENTS.md when a folder becomes a durable boundary with its own purpose, rules, responsibilities, workflow, materials, or quality standards
- Work Guidance must reflect the current standards of the project or user instructions; if there are no specific standards or instructions yet, leave it empty
- Verification must reflect an existing check; if no verification framework exists yet, leave it empty and update it when one exists

Default section order:
- Purpose
- Ownership
- Local Contracts
- Work Guidance
- Verification
- Child DOX Index

## Style

- Keep docs concise, current, and operational
- Document stable contracts, not diary entries
- Put broad rules in parent docs and concrete details in child docs
- Prefer direct bullets with explicit names
- Do not duplicate rules across many files unless each scope needs a local version
- Delete stale notes instead of explaining history
- Trim obvious statements, repeated rules, misplaced detail, and warnings for risks that no longer exist

## Closeout

1. Re-check changed paths against the DOX chain
2. Update nearest owning docs and any affected parents or children
3. Refresh every affected Child DOX Index
4. Remove stale or contradictory text
5. Run existing verification when relevant
6. Report any docs intentionally left unchanged and why

## User Preferences

When the user requests a durable behavior change, record it here or in the relevant child AGENTS.md

- The app never displays GPS coordinates as text anywhere. Navigation is a
  light teal navigate row (nav icon + street address) that appears when a
  `data.js` entry has a `geo` field (a real street address), and tapping it
  opens a map navigation link (`https://maps.google.com/?q=<address>`). Cards
  without a `geo` field (mobile/at-home practitioners, town-only) get no row.
  Raw lat/lng values never render; the `areas` town-centre coords exist only
  for nearest-area detection and the "Copy my location" fallback.
- The burger menu has a "Copy my location" action: it copies a shareable map link
  (`https://maps.google.com/?q=lat,lng`) to the clipboard so the reader can paste
  it into a message. It shows no coordinates in the app. If GPS is denied or
  unavailable it falls back to the chosen "My area" town centre and labels the
  copy as an approximate link.
- The burger menu has a "Share this page" action: it opens the native
  share sheet (`navigator.share`) where available so the reader can share the
  app's URL; where sharing isn't supported it falls back to copying the link to
  clipboard. It never renders coordinates.
- Primary navigation is a fixed bottom tab bar with four labelled tabs —
  **Directory**, **Checklist**, **First Aid**, **Helplines** — shown on all
  screen sizes (mobile and desktop), each an inline SVG icon over a name.
  The Directory tab shows search + My area + Quick access + the category
  lists; each tool tab shows only its own section with a search box that
  filters just that tab's content. The header burger menu holds only the two
  utility actions (Copy my location, Share).
- Installed users receive deployed updates automatically without reinstalling:
  navigation loads are network-first (offline falls back to the cached shell), sw.js
  registers with `updateViaCache: "none"` so GitHub Pages' 10-minute HTTP cache never
  delays a deploy, and when a new version takes over the page shows a small update
  banner (paper background, hairline top border, `primary` sage-teal Reload button, inline
  refresh icon — no crisis red) offering a one-tap reload. First-time installs show no
  banner.
- Category lists can be reordered so entries in the reader's area appear first
  ("My area" selector). The app requests the browser location once to pick the
  nearest area, stores the choice in `localStorage` under `pi:area`, and never
  shows the coordinates. The `areas` town-centre `lat`/`lng` values in
  `data.js` exist only for nearest-area detection and as the "Copy my location"
  fallback; never display them.
- The header's 4 emergency items (`APP.lifeline`) live in a single collapsible
  red section: tapping the section header expands/collapses the whole list,
  open reveals each number with its own one-tap dial row (dials immediately)
  and a big call button. There is no per-item expansion. Crisis red stays
  limited to the section, the rows and the call buttons.
- The app follows The Shore design system in `DESIGN.md` (warm sand canvas
  `#F5F2EC`, near-black ink type `#26221B`, hairline borders, sage-teal
  `#2E6E62` chrome accent).
  Crisis red is reserved strictly for emergency call actions (lifeline tiles,
  dial buttons, first-aid & helpline badges). Display headings use the
  self-hosted Fraunces font (`fonts/`); numerals use Space Mono; body stays
  Instrument Sans.
- Directory cards may show a small brand-logo chip (top-right, beside the star)
  for entries whose id is a key in `APP.logos`. Logos are full-colour brand
  marks — content, not chrome — set in a small white hairline chip, rendered
  decorative (`alt=""`); the title always carries the name. No logo ever
  replaces a dial row or the star, and lifeline tiles stay logo-free red call
  buttons.
- Cards render an `email` field as a light mailto row (teal accent — only dial
  and lifeline actions use crisis red), an `hours` field on its own line under
  the meta with a small clock glyph, and any WhatsApp-capable number as a
  light green WhatsApp row (green icon + number → wa.me, mirroring the email
  row's shape). A `geo` entry's address renders as a light teal navigate row
  (nav icon + address → Google Maps) in the same action stack; the card header
  holds only the title, logo chip and star.
- No emojis anywhere in the app or its data — use inline SVG icons only
  (`index.html` ICONS map, menu SVGs). Do not re-add `ic:`/`e:`/`icons` emoji
  fields to `data.js`.
- The app is mobile-first: every change must keep it mobile friendly. Layouts
  must avoid horizontal scroll on phone viewports, touch targets stay
  thumb-sized, text remains legible at small sizes, and desktop layouts are a
  progressive enhancement of the mobile experience, never the primary target.
  Verify responsive behaviour on a phone viewport before considering a change
  done.

## Deployment

- The app deploys to GitHub Pages from the `develop` branch via
  `.github/workflows/deploy-pages.yml`. Push to `develop` (or a manual run
  from the Actions tab) publishes only the app files — `index.html`,
  `data.js`, `tailwind.css`, `manifest.json`, `sw.js`, `icons/` — to
  https://juriespies.github.io/pringle-info/
- Dev-only files (`node_modules/`, `tests/`, `server.ts`, …) are not
  published.

## Child DOX Index

- No child AGENTS.md files are needed for the current repository structure.
- Root-owned files: `README.md`, `LICENSE`, `banner.jpg`, `video-thumbnail.jpg`, and root-level project documentation.
