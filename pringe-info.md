# Overstrand Lifeline — Overstrand Emergency & Community Directory

A lightweight, mobile-first Progressive Web App (PWA) for residents of the
Overstrand coastline (Pringle Bay, Betty's Bay, Kleinmond, Hermanus and the
wider Overstrand) to reach emergency contacts and safety checklists instantly.
The app is a static site — no server, no database, no accounts — built as a
single `index.html` (HTML + compiled Tailwind CSS + plain JS) with a
`manifest.json` and service worker so it can be installed on phones and works
offline once loaded.

This document is the as-built spec: it describes what the app currently is,
how the data is organized, and the dataset it ships. The canonical data source
is `data.js`; the canonical design rules are `DESIGN.md` and `AGENTS.md`.

## Files & tech

| File | Purpose |
|------|---------|
| `index.html` | **The whole app** — sticky header (lifeline + search + menu + theme toggle), Quick Access favourites, My Area selector, 10 contact accordions, Tools & Guides panel (preparedness checklist · first-aid quick guides · national helplines), install banner, light/dark mode, service-worker registration. All icons are inline SVG |
| `data.js` | **All the content** — `APP.lifeline`, `APP.areas`, `APP.logos`, `APP.categories`, `APP.firstAid`, `APP.helplines`, `APP.checklist`. Edit here to add/change numbers |
| `tailwind.source.css` + `tailwind.config.js` | Source for the compiled `tailwind.css` (rebuild with `bun run build`) |
| `manifest.json` | Enables "Add to Home Screen" (standalone, portrait, 192/512/maskable icons) |
| `sw.js` | Service worker (versioned cache) — precaches the app shell, brand logos and fonts; runtime-caches same-origin GETs; offline fallback to `index.html`. Bypassed while the dev server's live reload is active |
| `icons/` | App icons + `logos/` brand marks; `icon.svg` / `icon-maskable.svg` are the source of truth, `make_icons.py` rasterizes the PNGs |
| `fonts/` | Self-hosted Space Grotesk display font (woff2) — keeps headings branded offline |
| `server.ts` | Bun dev server — correct MIME types (SW + manifest) and live reload (`HOT=0` or `/?hot=0` disables it) |
| `tests/smoke.ts` | Playwright smoke tests (`bun run test`; dev server must be running) |
| `.github/workflows/deploy-pages.yml` | GitHub Actions — publishes the app to GitHub Pages on push to `develop` |

## Design system

The app follows the Notion-inspired system in `DESIGN.md`:

- **Warm paper canvas** (`#f6f5f4`-family surfaces), near-black ink type,
  hairline borders, minimal elevation.
- **One blue accent** (`primary`, ~`#0075de`) for chrome: search focus, links,
  the install pill, mail/navigate rows, checklist progress, the area pin.
- **Crisis red** (`crisis`, ~`#C1292E`) is reserved strictly for emergency call
  actions: the lifeline section, dial buttons, first-aid and helpline badges.
- **Amber** carries warning alerts (snake / bee / reporting notices); **green**
  stays on WhatsApp rows (green icon + number → `wa.me`, mirroring the blue
  email row's shape).
- **Typography**: Space Grotesk (self-hosted in `fonts/`) is the display face
  for the wordmark, headings and category titles (`font-display`); Inter is the
  body and phone-number face for legibility and tabular digits.
- **Emoji-free**: every icon is an inline SVG from the `ICONS` map in
  `index.html`. No emoji glyphs anywhere in the app or its data.
- **Mobile-first**: no horizontal scroll on phone viewports, thumb-sized touch
  targets, tap-to-dial everywhere, safe-area insets; desktop is a progressive
  enhancement of the mobile layout.

## UI & features (as built)

1. **Sticky header** — wordmark, Tools & Guides menu button, and light/dark
   theme toggle (system default on first visit, saved in `localStorage`
   `pi:theme`).
2. **Emergency lifeline** — the 4 items of `APP.lifeline` (Fire & Rescue,
   Ambulance, Police, Municipal) live in a **single collapsible red section**
   in the header. Tapping the section header expands/collapses the whole list;
   open, each number is its own row with a one-tap direct dial and a big call
   button. There is no per-item expansion. Crisis red stays limited to this
   section, the rows and call buttons.
3. **Search** — filters categories and cards by name, service, town or part of
   a number (matches titles, sub-lines, notes, numbers, email, hours and
   category text). Matching categories auto-open.
4. **Quick Access favourites** — tap the star on any card (directory or
   helpline) to pin it; pinned cards appear in a "Quick Access" section at the
   top (stored in `localStorage` `pi:favs`).
5. **My area** — an "Off — default order" selector of the 16 Overstrand towns.
   Entries mentioning the chosen area float to the top of every list. On first
   visit the app requests the browser location once to pick the nearest town
   centre (within 30 km) and stores the choice in `localStorage` `pi:area`.
   The `areas` town-centre `lat`/`lng` values exist only for this detection
   and the "Copy my location" fallback — they are never displayed.
6. **Directory cards** — each entry renders:
   - title + optional brand-logo chip (top-right, `icons/logos/*`, full-colour
     mark, decorative `alt=""`) + star;
   - sub-line (`m`), optional business-hours line (clock glyph), auto-linkified
     notes (URLs and emails become clickable links);
   - a **dial row per number** (`tel:` link; short 3–5-digit numbers like
     `10177` / `084 124` get a bigger dial-pad look);
   - a **WhatsApp row** for every SA mobile number (icon + number →
     `https://wa.me/<number>`), green to match the blue email row;
   - an **email row** (`mailto:`) when the entry has an `email` field;
   - a **navigate row** (nav icon + street address → Google Maps) only when the
     entry has a real street-address `geo` field. Cards without `geo` get no
     row. Raw lat/lng values never render anywhere.
7. **Tools & Guides (burger menu)** — a separate view with its own search:
   - **Fire Season Preparedness Checklist** — 7 groups / 28 items, progress
     bar and "X of 28 done" counter; progress saved on-device (`pi:check`);
   - **First Aid Quick Guides** — 4 groups / 18 guides; each card has
     signs / what to do / avoid / call numbers, distilled from AHA, Red Cross,
     St John Ambulance, ERC & WHO guidance — always call emergency services
     first, never a substitute for trained care;
   - **National Helplines (SA)** — toll-free numbers that work anywhere in the
     country, searchable and pinnable like any category;
   - **Emergency Directory** — returns to the contacts view.
8. **Copy my location** — copies a shareable map link
   (`https://maps.google.com/?q=lat,lng`) to the clipboard; if GPS is denied
   or unavailable it falls back to the chosen "My area" town centre and labels
   the copy as an approximate link. It never shows coordinates in the app.
9. **Share this page** — opens the native share sheet (`navigator.share`)
   where available; falls back to copying the app URL to the clipboard.
10. **Install banner** — shown when installable (`beforeinstallprompt`) with an
    Install button; footer also tells readers how to Add to Home Screen.
11. **Accessibility & polish** — skip link, `aria-live` confirmation toast,
    labelled controls, no-results message, open-state preserved across renders.

## PWA capabilities

- `manifest.json`: name, short name "Lifeline", description, `standalone`
  display, portrait orientation, theme/background colours, 192/512/maskable
  icons, Apple touch icon and meta tags.
- `sw.js`: precaches `index.html`, `tailwind.css`, `data.js`, `manifest.json`,
  all `icons/` (including `logos/`) and the Space Grotesk font; cache-first
  reads with runtime caching of successful same-origin GETs and a fallback to
  `index.html` offline. Cache version is bumped on release
  (`v2.9.0` — email rows + hours line; `v2.8.0` — brand logos on cards;
  `v2.7.0` — Space Grotesk; `v2.6.0` — Notion redesign).
- Registration happens on `load` unless the dev live-reload flag
  (`window.__PRINGLE_HOT__`) is set, so production keeps working offline.

## Data organization

`data.js` exposes a single `APP` object:

- `APP.lifeline` — 4 header emergency numbers (see below).
- `APP.areas` — 16 towns with `aliases` (lowercase, no spaces) matched against
  entry text for local-first sorting, plus approximate `lat`/`lng` town
  centres (never displayed).
- `APP.logos` — entry id → logo file path. Rendered as a small chip on cards
  whose id is a key; already cached by the service worker.
- `APP.categories` — **10 numbered accordion sections**. Each may have an
  `intro` (blue-ish guidance line) and/or `alert` (amber notice) above its
  `entries`.
- `APP.firstAid.groups[].guides[]` — guides with `t`, `signs[]`, `do[]`,
  `dont[]`, `call[]` (numbers to dial for that scenario).
- `APP.helplines.entries[]` — national numbers, same `{ t, n[] }` shape as a
  category card.
- `APP.checklist.groups[]` — checklist groups with `title` + `items[]`
  (each `{ id, t }`).

Entry schema (category cards):

```js
{ id, t: title, m: sub-line (address/town/hours summary),
  n: [{ d: display number, l: optional label }],   // dial rows
  note: extra info (URLs/emails auto-linkify),
  email: mailto row,  hours: hours line,  geo: navigable street address }
```

Search matches the title, sub-line, notes, numbers and the category title — so
searching "Snake" surfaces the whole Snake Removal section.

## Dataset

### Emergency lifeline (sticky header, single collapsible red section)

- Fire & Rescue — 028 312 2400 — Fire & Rescue Services
- Ambulance — 10177 — Provincial · 24/7
- Police — 028 271 8200 — SAPS Kleinmond · crimes in progress
- Municipal — 028 313 8111 — Infrastructure · 24/7

### 01 · Fire & Emergency Response

*Community teams respond in their immediate area. Call your local team first, then Fire or Ambulance.*

- BEST — Betty's Bay Emergency Support Team — 066 165 6061 (Emergency)
- PBM — Pringle Bay Medics — Pringle Bay — 082 232 8048 (Emergency) — responds only to emergencies in its immediate area
- Volunteer Assistance — community volunteers — 072 616 8418 · 074 141 7600
- Community WhatsApp Groups — 074 823 8501 (Join for notifications)

### 02 · Medical & Clinics

*Ambulances: Provincial 10177 · ER24 084 124 · CMC 028 001 0544.*

- ER24 Ambulance — Somerset West — 084 124 (Emergency) — er24.co.za
- CMC Critical Medical Care — Kleinmond & Hermanus — 028 001 0544 (Emergency)
- OneHealth Medical & Wellness Centre — 24/7 · 4 Harbour Rd, Kleinmond · 021 770 0053 (Main) — Drs Leon Siecker, Tim Nunn, Eileen Brown — email onehealthreception@oec24.com — hours Mon–Fri 8–5, Sat 8–1, Sun & hols 10–12, emergency always 24/7 — oec24.com
- Dr Japie Roos — Paediatrician @ OneHealth, Kleinmond — 028 001 0548 (Surgery)
- Kleinmond Clinic — state clinic · Cnr Protea & Main Rd, Kleinmond — 028 814 3830 (Tel)
- Kogelberg Medical Practice — 2666 Porter Drive, Betty's Bay — 063 933 5463 (Reception) — Drs Jordaan & Prinsloo — email kogelbergmedicalpractice@gmail.com — hours Mon–Fri 8–5 — kogelbergmedprac.com
- Dr Greeff — Betty's Bay — 028 272 9999 (Surgery) · 082 659 9437 (After hours)
- Dr Audrey Zietsman — Pringle Bay — 071 687 3825 (Tel)
- Dr Gary Hudson — Kleinmond — 073 816 6763 (WhatsApp only)
- Drs Du Plessis, Van Niekerk & Morkel — Kleinmond — 028 271 4227 (Tel)

### 03 · Dentists

*Online bookings: mygc.co.za.*

- Dr Duvenhage — 028 271 3467 (Tel) · 082 861 0616 (Mobile)
- Dr Engelbrecht — 028 271 3662 (Tel) · 028 271 3667 (Alt)
- Dr Jolani Klopper — 028 271 3266 (Tel)

### 04 · Pharmacies

- Pharmacy Betty's Bay — 028 001 0550 (Tel) · 082 868 4267 (Mobile)
- Pringle Bay Pharmacy — 021 300 1716 (Tel) · 063 637 4430 (Emergency)
- Albertyn Pharmacy — At Spar, Kleinmond — 028 271 4666 (Tel) · 082 868 4267 (Mobile) — Shop 1A & 4 Spar Centre, Botriver Rd, Kleinmond
- The Local Choice Pharmacy — Kleinmond — 028 271 3320 (Tel) · 082 652 4309 (Mobile)

### 05 · Allied Health & Therapies

- Marinet — Dial a Physio · Kleinmond — 084 549 2981 (Tel)
- Hardus Smith — Physiotherapy · Kleinmond — 066 002 7973 (Tel)
- Anita Schröder — Schröder Physiotherapy Inc · Pringle Bay — 082 806 8192 (Tel)
- Catherine's Care — Catherine Rowe — MLD & therapeutic massage · Kleinmond Central — 078 419 1232 (Tel)
- Tamora — reflexology · Kogelberg Medical Centre, Betty's Bay — 082 465 0558 (WhatsApp for appointment)
- Philip Obermeyer — Optometrist · 17 Spar Centre, Kleinmond — 028 271 3119 (Tel) · 064 824 0702 (Mobile) — oberkleinmond@gmail.com
- Elsie Scott — Biokineticist — 072 138 9146 (Tel)
- Licille Slabbert — Dietician — 081 771 3220 (Tel)
- Hilda Woudstra — Dietician — 083 631 7550 (Tel)
- Dr Samuel Gild — Counsellor · William Avenue, Pringle Bay (or online) — +27 76 681 7135 (Tel) — sam.gild@gmail.com
- Hestie Endrödy — Clinical psychologist · 41 Main Rd, Kleinmond — 082 853 7936 (Tel)
- Dr Zendré Swanepoel — Psychologist — 083 227 4971 (Tel)
- Sulene Swanepoel — Play therapist — 083 443 7616 (Tel)
- Oystercatcher's Nest — Breastfeeding support (Marie-Louise) — 079 116 5630 (Tel)
- Karen Wood — Private nurse practitioner, advanced wound care — 073 797 0381 (Tel) — kwood56@hotmail.com
- Sitara — End-of-Life Doula & Grief Support (Marie-Louise) — 079 116 5630 (Tel)

### 06 · Animals & Wildlife

- Dr Floris Kruger — Veterinarian, general & wildlife — 028 880 0094 (Tel) · 064 527 7346 (After hours)
- Dr Peter Dave — Veterinarian — 028 271 4183 (Tel) · 072 564 9903 (After hours)
- Kogelberg Wildlife Rescue Centre — Michelle Watson — 073 314 0674 (Rescue)
- Cape Nature — 082 783 8585 (Duty phone) · 087 087 9262 (Office hours) · 082 319 1646 (Stony Point) — 16 17th Ave, Voëlklip, Hermanus — customercare@capenature.co.za — hours Mon–Fri 07:30–16:30, Sat 8–12
- Sick Sea Birds — Gavin — 073 682 0697 (Tel)
- Stranded Sea Turtle Rescue — 083 300 1663 (Hotline) — do not put stranded turtles back into the water
- Bird Flu Reporting — SANCCOB — 078 638 3731 (Report) — photo + GPS pin to track bird flu; also 021 557 6155 (daytime) — sanccob.co.za
- KAWS — Kleinmond Animal Welfare Society — 028 271 5004 (Office hours) · 079 739 4354 (After hours)
- Law Enforcement — report loose or mistreated dogs — 028 313 8996 (Report) — enquiries@overstrand.gov.za
- Baboon Hotline — Kleinmond · Betty's Bay · Pringle Bay — 069 151 5962 (Hotline) — report via WhatsApp (messages/voice notes/photos/location pins, not calls)
- Renee Bish — Betty's Bay — 060 656 7341 (Tel)
- Elsa Jacobs — 083 283 7362 (Tel)
- Rivendell Kennels — Boarding — 028 284 9801 (Tel)
- Honingklip Cattery — Boarding — 071 136 5307 (Tel)
- Heart2Soul Connection — Gayle — animal communication — 063 636 3216 (Tel) — info@heart2soulconnection.com
- Pet Loss Counsellor — Marie-Louise — 079 116 5630 (Tel)

### 07 · Snake Removal

*Catchers charge a call-out fee. Stay well back — a snake can strike about half its body length; never corner, poke or try to kill it. The Overstrand has four dangerously venomous snakes: Puff Adder, Cape Cobra, Rinkhals, Boomslang. Any bite is a medical emergency — get to a hospital straight away.*

- Michelle Watson — Kogelberg Wildlife Rescue Centre — 073 314 0674 (Removal)
- Edward Olivier — Kleinmond — 068 600 7903 (Removal)
- Johan Westland — Kleinmond — 066 499 5087 (Removal)
- Marcus Butler — Pringle Bay — 064 611 3893 (Removal)
- Jonathan Powers — Hermanus area — 082 352 6000 (Removal)
- Corné Uys — Hermanus area — 076 075 8004 (Removal)
- Hugo Uys — Hermanus area — 062 482 5410 (Removal)
- Arno Naude — Snakebite assistance — 083 739 9303 (Assistance)

### 08 · Bee & Wasp Removal

*Bee keepers charge for their call-outs. The Cape Honey Bee Conservancy re-homes swarms rather than destroying them and clears German & European wasp nests with eco-friendly methods.*

- Gys Boonzaaier — 083 225 5695 (Removal)
- Deon Pretorius — 072 656 3981 (Phone only)
- Sunra Mosterd — 083 384 7820 (Removal)
- Inge de Villiers — 076 827 1245 (Removal)
- Cape Honey Bee Conservancy — Lourens / Dylan Kruger — 076 564 8119 (Bee & wasp removal)

### 09 · Sea Rescue & Marine

*The NSRI is South Africa's sea rescue institute — call for emergencies on or near the water.*

- NSRI Station 42 — Kleinmond — 063 699 2765 (Sea rescue) — info@searescue.org.za — 24/7 volunteer station
- NSRI — Hermanus (Station 17) — 082 990 5967 (Sea rescue) — info@searescue.org.za — 24/7 volunteer station

### 10 · Municipal & Reporting

*When you report a sighting, give as much detail as you can: the exact spot, what you saw and when, anything identifiable (boat registration numbers, clothing). Don't confront anyone — let the authorities handle it.*

- Infrastructure Emergencies — Municipal · 24/7/365 — 028 313 8111 (Emergency) — also reportable via the Overstrand Collab Citizen App
- Overstrand Law Enforcement — 028 313 8996 (Tel) — enquiries@overstrand.gov.za
- DFFE — Poaching / Green Scorpions — 028 313 2703 (Report)
- HPP — Hermanus Public Protection — 087 550 5295 (Tel)
- Onrus / Vermont SRA Emergency — 079 469 8606 (Emergency)
- Kleinmond SAPS — 16 Main Rd, Kleinmond — 028 271 8200 (Tel) · 028 271 8202 (Alt) · 082 443 6069 (Mobile) — KLEINMONDSAPS@saps.gov.za
- Hermanus Police — 61 Main Rd, Hermanus — 028 313 5300 (Tel) — HermanusSAPS@saps.gov.za
- Gansbaai Police — 16 Main St, Gansbaai — 028 384 0201 (Tel) — GANSBAAISAPS@saps.gov.za
- Stanford Police — 6 Du Toit St, Stanford — 028 341 0601 (Tel) — StanfordSAPS@saps.gov.za
- Overstrand Important Numbers — municipal website — switchboard 028 313 8000 · Fire & Rescue 028 312 2400 · Traffic 028 313 1044 · overstrand.gov.za

### National helplines (anywhere in SA)

- National Emergency (cell) — 112 — any network, even without airtime
- SAPS / Flying Squad — 10111 — police emergency
- Provincial Ambulance — 10177 — free · Emergency Medical Services
- Netcare 911 — 082 911 — private · 24/7
- ER24 — 084 124 — private · 24/7
- Poisons Info Centre — 0861 555 777 — Tygerberg · 24/7 poison advice
- SADAG Suicide / Crisis — 0800 567 567 — 24/7 mental health line
- Lifeline Counselling — 0861 322 322 — 24/7 crisis counselling
- Childline SA — 0800 055 555 — child protection & crisis

### Fire Season Preparedness Checklist (7 groups · 28 items, progress saved on-device)

- **Covered Before It Happens** — property properly insured · current interior & exterior photos for the insurer · plan for power cuts · all pets microchipped
- **Fire-Wise Yard** — fire-wise garden & defendable space · sufficient water supply and hoses · gutters clean and leaf-free · firewood/flammables moved away · exterior taps with hose attachments · clear fire-truck access · nearest fire hydrant marked and clear
- **Emergency Gear** — extinguishers, fire blankets, beaters · protective clothing (leather boots, gloves, broad-brimmed hats, filter masks, goggles, eye drops) · torches/headlamps with spare batteries
- **First Aid & Supplies** — first aid kit with burn-care dressings and prescription medicines · candles, matches or lighters · 3 days non-perishable food · bottled water — 5L per person per day
- **Evacuation Plan** — prepare the property as if staying · watch Overstrand & community WhatsApp notifications · assign tasks (IDs, documents, meds, pet supplies, valuables) · agree who informs the zone manager, family and neighbours
- **Vehicle Readiness** — adequate fuel at all times · pack water, first aid kit with burn dressings, wool blanket and a local route map
- **If You Stay to Protect** — assign who wets down garden, decks and wooden frames · turn off gas, close windows, wet towels under doors, move flammables indoors · keep gates open · never block roads

### First Aid Quick Guides (4 groups · 18 guides)

Each guide carries one-line signs / what-to-do / avoid / call numbers (typically 10177 + ER24 084 124). Content distilled from AHA, Red Cross, St John Ambulance, ERC & WHO guidance. Full steps live in `data.js` `APP.firstAid`.

- **Cardiac & Breathing** — Heart Attack · Cardiac Arrest & CPR · Choking (Adult & Child) · Stroke — FAST
- **Injury & Trauma** — Severe Bleeding · Burns & Scalds · Head Injury & Concussion · Broken Bone / Fracture
- **Environmental & Medicine** — Severe Allergic Reaction · Snakebite (SA) · Drowning / Near-Drowning · Hypothermia / Cold · Heat Stroke / Exhaustion · Electric Shock
- **Medical Emergencies** — Poisoning (Poisons Info Centre 0861 555 777) · Severe Asthma Attack · Diabetic Emergency (Low Sugar) · Seizure / Epilepsy · Fainting & Recovery Position

## Data rules (privacy & trust)

- The app never displays GPS coordinates as text anywhere. Only real street addresses (`geo`) may render, as a light blue navigate row that opens Google Maps.
- `APP.areas` `lat`/`lng` town centres exist solely for nearest-area detection and the "Copy my location" fallback (which labels the copy as an approximate link when it uses the town centre).
- No emojis in the app or its data — inline SVG icons only.
- Directory numbers come from Overstrand Municipality and community notices; verified details (addresses, hours, emails, websites) were added from official sources (municipality, SAPS, NSRI, practices, Medpages). Keep `data.js` aligned with the official list: overstrand.gov.za/important-numbers-2.

## Verification & deployment

- `bun install` (first time), `bun run dev` (http://localhost:8080), `bun run build` (rebuild `tailwind.css` after editing `index.html`), `bun run watch:css`, `bun run test` (Playwright smoke tests; dev server must be running — the tests use `/?hot=0` for production parity).
- Pushing to `develop` (or running the workflow manually from the Actions tab) deploys the app files — `index.html`, `data.js`, `tailwind.css`, `manifest.json`, `sw.js`, `icons/`, `fonts/` — to https://juriespies.github.io/pringle-info/. Dev-only files (`node_modules/`, `tests/`, `server.ts`) are never published.
