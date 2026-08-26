# Overstrand Lifeline — Overstrand Emergency Directory

A phone-first **PWA** (Progressive Web App) that puts the Overstrand's emergency
and community contact numbers one tap away: fire, ambulance, police, doctors,
pharmacies, vets, snake & bee removal, sea rescue, municipal services — plus
**first-aid quick guides**, **national helplines**, and an interactive
fire-preparedness checklist.

It's a **static app** — no server, no database, no accounts — so it's fast,
installable, and works fully **offline** once loaded.

Places in **your area** move to the top of every list: the app asks for your
location once to pick the nearest Overstrand town (changeable via the **My
area** selector; coordinates are never shown).

## Files

| File | Purpose |
|------|---------|
| `index.html` | **The whole app** — HTML + compiled Tailwind CSS + plain JS: sticky lifeline, search, accordion categories, light/dark mode, **favourites pinning, WhatsApp rows**, service-worker registration — plus a **Tools & Guides** menu (directory · preparedness checklist · first-aid quick guides · national helplines · copy my location · share this page), with a dedicated search inside the Tools view |
| `data.js` | **All the content** — edit here to add/change numbers |
| `server.ts` | Bun dev server — static files with correct MIME types (SW + manifest) and **live reload** |
| `tests/smoke.ts` | Playwright smoke tests (`bun run test`) |
| `tailwind.css` | Compiled Tailwind utility classes (generated, ~19 KB) |
| `DESIGN.md` | Notion-style design system reference the UI follows (colors, type, components) |
| `tailwind.config.js` + `tailwind.source.css` | Source for rebuilding `tailwind.css` |
| `manifest.json` | Enables "Add to Home Screen" |
| `sw.js` | Service worker — caches the app for offline use |
| `icons/` | App icons + partner logos — `icon.svg` / `icon-maskable.svg` are the source of truth; `make_icons.py` rasterizes the PNGs (requires ImageMagick) |
| `fonts/` | Self-hosted Space Grotesk display font (woff2) — keeps headings branded offline |
| `.github/workflows/deploy-pages.yml` | GitHub Actions — publishes the app to GitHub Pages on push to `develop` |

To rebuild the compiled CSS after editing `index.html`:

```sh
bun run build
```

## Development (live reload)

```sh
bun run dev
```

The dev server comes with live reload, on by default:

- Editing `index.html`, `data.js`, `icons/`, `tailwind.css`, … **reloads the
  browser tab automatically**.
- Editing a `*.css` file (e.g. `tailwind.source.css` then `bun run build`)
  **hot-swaps the stylesheet in place** without a reload.
- While live reload is active the service worker is bypassed, so its cache can
  never show you stale files. Production behavior is untouched.

To turn it off:

```sh
HOT=0 bun run server.ts
```

Or opt one request out with `/?hot=0` — the smoke tests use exactly this to get
production parity (service worker + offline) while the server is running:

```sh
bun run test
```

> The dev server doesn't restart itself — after editing `server.ts`, restart
`bun run dev` (the open tab will reconnect and reload automatically).

## Run it (Bun)

Service workers and install require **http(s)**, not `file://`. From this folder:

```sh
bun install   # first time only
bun run dev   # serves http://localhost:8080
```

Other commands:

```sh
bun run build      # rebuild tailwind.css after editing index.html
bun run watch:css  # rebuild automatically while developing
bun run test       # Playwright smoke tests (dev server must be running)
```

## Deployment (GitHub Pages)

Pushing to `develop` (or running the workflow manually from the **Actions**
tab) deploys the app to GitHub Pages:

- Live: https://juriespies.github.io/pringle-info/
- The workflow copies only the app files (`index.html`, `data.js`,
  `tailwind.css`, `manifest.json`, `sw.js`, `icons/`) into the published
  folder, so dev files (`node_modules/`, `tests/`, `server.ts`) never go live.

## Install on your phone

- **Android (Chrome):** menu → *Add to Home screen*
- **iPhone/iPad (Safari):** Share → *Add to Home Screen*

## Adding or editing a number

All content lives in `data.js`. An entry looks like:

```js
{ id: "greeff", t: "Dr Greeff", m: "Betty's Bay",
  n: [{ d: "028 272 9999", l: "Surgery" }, { d: "082 659 9437", l: "After hours" }] }
```

- `t` title · `m` sub-line (address/hours) · `note` extra info · `n` list of
  `{ d: display number, l: optional label }`. Add entries to the right
  category's `entries` array. The emergency strip is `APP.lifeline` at the top.
- `APP.firstAid.groups[].guides[]` (`t` title, `signs`/`do`/`dont`
  step lists, `call[]` dial numbers) feeds the First Aid Quick Guides
  accordion; `APP.helplines.entries[]` (same `{ t, n[] }` shape as a card)
  feeds National Helplines. Both are searchable like any category.
- Search matches the title, sub-line, notes, numbers and the category title —
  so searching "Snake" surfaces the whole Snake Removal section.

> Numbers are from Overstrand Municipality and community notices. Check the
> [official list](https://www.overstrand.gov.za/important-numbers-2/) for
> changes — keep `data.js` up to date.
