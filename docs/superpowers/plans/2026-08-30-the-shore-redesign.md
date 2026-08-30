# The Shore — Visual Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reskin Overstrand Lifeline's look — new typefaces (Fraunces / Space Mono / Instrument Sans), warm "shore" sage-teal palette, de-AI'd chrome — with zero functional change.

**Architecture:** Pure presentational change. All color/type tokens live in `tailwind.config.js` + `tailwind.source.css` (rebuild → `tailwind.css`); `index.html` swaps a few font/class references; `sw.js` precache list and version bump; stale smoke test repaired. No `data.js`, no JS logic, no PWA/deploy changes.

**Tech Stack:** Tailwind CSS 3.4 (CLI build), Bun, Playwright smoke tests, self-hosted Google Fonts (SIL OFL) woff2.

## Global Constraints

- **No functional changes.** Accordions, search, favourites, My Area, tools panel, offline, install, update banner — behaviour identical.
- **Crisis red `#C1292E` reserved for emergency actions only** (lifeline, dial buttons, first-aid & helpline badges). Never render coordinates; emoji-free; inline SVG icons only.
- **All WCAG AA contrast** (verified in spec): teal `#2E6E62` 5.96:1 on white, white-on-teal 5.96:1, white-on-crisis 5.79:1, ink `#26221B` 14.16:1 on paper. Every new token pair must stay ≥4.5:1 (text) / ≥3:1 (UI).
- **Mobile-first:** no horizontal scroll on phone viewports, thumb-sized targets, no `backdrop-blur` on header.
- **Do NOT commit anything** to git during or after implementation.
- Fonts are self-hosted (`fonts/*.woff2`), SIL OFL — offline-safe; no Google Fonts network dependency remains.

---

### Task 1: Swap fonts — download + register Fraunces, Space Mono, Instrument Sans

**Files:**
- Create: `fonts/fraunces-latin.woff2`, `fonts/space-mono-latin.woff2`, `fonts/instrumentsans-latin.woff2`
- Delete: `fonts/space-grotesk-latin.woff2`
- Modify: `tailwind.source.css`, `tailwind.config.js`, `index.html` (font link), `sw.js` (ASSETS + VERSION)

**Interfaces:**
- Produces: three `@font-face` families — `Fraunces` (wght 400–900), `Space Mono` (400/700), `Instrument Sans` (400–700) — each with latin-subset `fonts/<name>-latin.woff2`; config font tokens `font-display` → `'Fraunces'`, `font-sans` → `'Instrument Sans'`, `font-num` → `'Space Mono'`.

- [ ] **Step 1: Download the latin-subset woff2 files**

Use the Google Fonts CSS2 API with a desktop Chrome UA to get woff2 URLs, take the LAST `url(...)` in each family block (that's the `U+0000-00FF` latin subset), and save to `fonts/`:

Run:
```sh
cd fonts
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"
curl -s "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400..900&display=swap" -A "$UA" \
  | grep -o 'https://fonts.gstatic.com/[^)]*' | tail -1 | xargs curl -s -o fraunces-latin.woff2
curl -s "https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" -A "$UA" \
  | grep -o 'https://fonts.gstatic.com/[^)]*' | tail -1 | xargs curl -s -o space-mono-latin.woff2
curl -s "https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&display=swap" -A "$UA" \
  | grep -o 'https://fonts.gstatic.com/[^)]*' | tail -1 | xargs curl -s -o instrumentsans-latin.woff2
rm -f space-grotesk-latin.woff2
ls -la
```
Expected: three new `*.woff2` files present, `space-grotesk-latin.woff2` gone. Each file >10 KB (verify: `file fraunces-latin.woff2`).

Note: Instrument Sans has a single variable latin file serving 400–700; Space Mono needs only the latin file (variable or 400/700 — the css2 API returns one latin file per weight; if two files appear, keep the 400 one and add a 700 static too. Simplest: download both weight-specific latin files if present and register them both).

- [ ] **Step 2: Update `@font-face` in `tailwind.source.css`**

Replace the whole Space Grotesk `@font-face` block (lines 4–12) with:

```css
/* Display serif — wordmark, headings, category & section titles. Self-hosted (latin) so the brand look survives offline. */
@font-face {
  font-family: "Fraunces";
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
  src: url("fonts/fraunces-latin.woff2") format("woff2");
}

/* Numerals — every dialable phone number, counts and badges (tabular, unmistakable). */
@font-face {
  font-family: "Space Mono";
  font-style: normal;
  font-weight: 400 700;
  font-display: swap;
  src: url("fonts/space-mono-latin.woff2") format("woff2");
}

/* Body — all copy, labels, meta, buttons, search placeholder. */
@font-face {
  font-family: "Instrument Sans";
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
  src: url("fonts/instrumentsans-latin.woff2") format("woff2");
}
```

(If the download produced separate 400 and 700 Space Mono files, register both with two `@font-face` blocks pointing at the two files.)

- [ ] **Step 3: Update `tailwind.config.js` fontFamily**

Replace the `fontFamily` block (lines 31–53) with:

```js
fontFamily: {
    display: ["'Fraunces'", "Georgia", "serif"],
    sans: [
        "'Instrument Sans'",
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        "Helvetica",
        "Arial",
        "sans-serif",
    ],
    num: ["'Space Mono'", "ui-monospace", "SFMono-Regular", "monospace"],
},
```

- [ ] **Step 4: Update `index.html` font loading**

Replace the two Google Fonts `<link>` tags (lines 16–18) with nothing — fonts are now self-hosted via `tailwind.css`:

Remove:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

- [ ] **Step 5: Update `sw.js` precache list + version**

In `sw.js`:
- Bump `const VERSION = "v2.9.0";` → `"v3.0.0"` (update the trailing comment: `// v3.0.0 — The Shore redesign (Fraunces / Space Mono / Instrument Sans, sage-teal)`).
- Replace `"./fonts/space-grotesk-latin.woff2",` with:
```js
    "./fonts/fraunces-latin.woff2",
    "./fonts/space-mono-latin.woff2",
    "./fonts/instrumentsans-latin.woff2",
```

- [ ] **Step 6: Rebuild CSS + verify fonts load**

Run: `bun run build`
Expected: exit 0, `tailwind.css` regenerated. Then grep the compiled css:
Run: `grep -c "Space Mono\|Fraunces\|Instrument Sans" tailwind.css`
Expected: ≥3 (the three `@font-face` names present in the output).

- [ ] **Step 7: Verify in browser (manual)**

Open `http://localhost:8080/?hot=0` (dev server already running). Inspect the wordmark — should now render in a serif (Fraunces). DevTools → Network → Fonts: three woff2 requests to localhost succeed; NO requests to `fonts.gstatic.com` or `fonts.googleapis.com`.

Note: no commit (per global constraint).

---

### Task 2: Shore palette — token swap in `tailwind.config.js`

**Files:**
- Modify: `tailwind.config.js`

**Interfaces:**
- Consumes: `fontFamily` tokens from Task 1.
- Produces: color tokens `paper`, `ink` (DEFAULT/soft/muted/faint), `hairline`, `primary` (DEFAULT/dark/light/soft) = sage-teal ramp, `crisis` unchanged. Existing `stone-*` Tailwind defaults stay (they're already warm-neutral and used for dark surfaces); do NOT re-theme `stone`.

- [ ] **Step 1: Replace the `colors` block (lines 10–30)**

```js
colors: {
    paper: "#F5F2EC", // warm sand canvas
    ink: {
        DEFAULT: "#26221B", // warm near-black
        soft: "#4A453B", // warm charcoal
        muted: "#6E685A", // stone
        faint: "#A39B8B", // ash (decorative only)
    },
    hairline: "#E4DCCB", // warm hairline dividers
    primary: {
        DEFAULT: "#2E6E62", // sage-teal — chrome accent (links, search, area, install, mail/nav)
        dark: "#22544B", // pressed state
        light: "#7FBFB2", // teal on dark surfaces
        soft: "#E6EFEC", // pale teal wash
    },
    crisis: {
        DEFAULT: "#C1292E", // emergency red — lifelines & dial actions only
        dark: "#9E1E22",
        light: "#E8B4B0",
    },
},
```

- [ ] **Step 2: Rebuild + verify token classes compile**

Run: `bun run build`
Expected: exit 0. Verify the compiled css contains the new values:
Run: `grep -o "#2E6E62\|#F5F2EC\|#E4DCCB\|#22544B\|#7FBFB2\|#E6EFEC" tailwind.css | sort -u`
Expected: all six hex values present. Verify the old blue is gone:
Run: `grep -c "#0075de" tailwind.css`
Expected: `0`.

- [ ] **Step 3: Verify visual output (manual)**

Refresh `http://localhost:8080/?hot=0` — links, search focus, area pin, install pill, checklist progress, mail/nav rows now sage-teal; paper is warm sand; crisis red on lifeline/dial unchanged. Dark mode toggle still works (teal-light `#7FBFB2` on dark).

Note: no commit.

---

### Task 3: Font application — add numeral face, drop blur, de-AI the chrome

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: `font-num` (Space Mono), `font-display` (Fraunces), palette tokens from Tasks 1–2.
- Produces: every dialable number in `font-num`; opaque header (no `backdrop-blur`); serif headings keep `font-display`; `.lnk`/focus/underline colors updated to teal.

- [ ] **Step 1: Remove the header blur**

In `<header ...>` (line 51) remove the `backdrop-blur` class and the `/90`/`/95` alpha on `bg-paper` / `dark:bg-stone-950` so the header is a solid opaque band:

Change: `bg-paper/90 backdrop-blur border-b border-hairline dark:bg-stone-950/90 dark:border-stone-800`
To: `bg-paper border-b border-hairline dark:bg-stone-950 dark:border-stone-800`

Also in the update banner (line 167): `bg-paper/95 ... backdrop-blur dark:bg-stone-950/95` → `bg-paper dark:bg-stone-950` (keep the border-t and safe-area padding).

- [ ] **Step 2: Update the inline `.lnk` + `dial:active` style block (lines 42–44)**

```css
.lnk { color: #2E6E62; text-decoration: underline; text-underline-offset: 2px; }
.dark .lnk { color: #7FBFB2; }
```

- [ ] **Step 3: Set every dialable number in Space Mono**

Add `font-num` to each element whose text is a phone number:

- Lifeline direct-dial link (line ~254): `class="block text-[15px] font-extrabold leading-tight tracking-tight tabular-nums hover:underline"` → add `font-num`.
- Lifeline Call button text (line ~256): the `<span>Call ${esc(t.d)}</span>` → wrap the number in a `font-num` span, i.e. `<span class="font-num">${esc(t.d)}</span>` (keep the word "Call" in sans).
- Card dial row number (line ~275): `<span class="block font-extrabold text-stone-900 tabular-nums group-hover:text-white dark:text-stone-100 ${showNum ? "text-lg tracking-wide" : "text-base"}">${esc(x.d)}</span>` → add `font-num` to the class list.
- WhatsApp row (line ~282): `<span class="min-w-0 text-sm font-semibold tabular-nums">${esc(x.d)}</span>` → add `font-num`.
- First-aid call chip (line ~468): `${ICONS.phone}${esc(c.d)}` → `${ICONS.phone}<span class="font-num">${esc(c.d)}</span>`.
- Helplines render via `cardHTML`, so they inherit the card dial-row/wa-row changes automatically.

Remove `tabular-nums` from any element that already gets `font-num` (Space Mono is monospaced; `tabular-nums` is redundant and could cause a letter-spacing shift).

- [ ] **Step 4: Category number pills + counts → mono**

Category summary number pill (line ~359): add `font-num` to `class="shrink-0 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-bold text-primary tabular-nums dark:bg-primary/20 dark:text-primary-light"` and drop `tabular-nums`.

Entry count (line ~361) `<span class="shrink-0 text-xs font-semibold text-stone-400 tabular-nums">${c.entries.length}</span>` → add `font-num`, drop `tabular-nums`. Same for helplines count (line ~503).

- [ ] **Step 5: Serif display pass (verify, tweak only if needed)**

Headings already carry `font-display` (wordmark line 55, section headings, category titles). Confirm Fraunces is now applied. If the eyebrow line (line 56) `font-display text-[11px] uppercase tracking-widest` looks too heavy in Fraunces, swap it to `font-sans` (body) — eyebrow labels read better in the quiet sans.

- [ ] **Step 6: Rebuild + smoke check**

Run: `bun run build` (rebuild tailwind.css so `font-num` classes exist). Then:
Run: `grep -c "font-num" tailwind.css`
Expected: ≥1.

Note: no commit.

---

### Task 4: Repair the stale smoke test

**Files:**
- Modify: `tests/smoke.ts`

**Interfaces:**
- Consumes: current app structure (single collapsible `#lifelinePanel` details; 6 menu items incl. Share; `#cat-*` ids).
- Produces: a green `bun run test` that reflects the real app and still passes after the reskin.

**Context — pre-existing breakage:** the test still asserts the OLD per-item lifeline (`#ll-fire`, 4 expandable `<details>` in `#lifelineGrid`, 5 menu items). The app was refactored to a single collapsible lifeline section (commit `025cfbe`) and gained a Share menu item (`fd62134`); the test has been failing since. This task aligns the test with the current app; the redesign must not change these numbers.

- [ ] **Step 1: Run the test to confirm the failure mode**

Run: `bun run test` (dev server is running)
Expected: fails at `#ll-fire` timeout (line 48). This confirms the baseline.

- [ ] **Step 2: Rewrite the lifeline assertions (lines 36–76)**

Replace the block from `"lifeline: 4 expandable items"` through the collapse assertion with the single-section reality:

```ts
// ---- lifeline (single collapsible section) ----
assert(
    (await page.locator("#lifelineGrid details").count()) === 1,
    "lifeline: one collapsible section",
);
assert(
    (await page.locator("#lifelineGrid a[href^='tel:']").count()) === 8,
    "lifeline: 4 direct-dial numbers + 4 call buttons",
);
assert(
    !(await page.locator("#lifelinePanel").evaluate((el) => el.open)),
    "lifeline: section starts collapsed",
);
await page.click("#lifelinePanel summary");
await page.waitForTimeout(200);
assert(
    await page.locator("#lifelinePanel").evaluate((el) => el.open),
    "lifeline: tapping the header expands the section",
);
await page.click("#lifelinePanel a[href^='tel:']");
await page.waitForTimeout(200);
assert(
    await page.locator("#lifelinePanel").evaluate((el) => el.open),
    "lifeline: tapping a number dials without collapsing",
);
await page.click("#lifelinePanel summary");
await page.waitForTimeout(200);
assert(
    !(await page.locator("#lifelinePanel").evaluate((el) => el.open)),
    "lifeline: tapping the header collapses the section",
);
```

Note the existing `tel: links === 147` assertion (line 44) is unchanged and must still pass.

- [ ] **Step 3: Fix the menu item count (line 100–103)**

Change `"tools menu: 5 items (directory + 3 sections + copy location)"` to expect `6` (Emergency Directory, Preparedness Checklist, First Aid, National Helplines, Copy my location, Share) and update the label string to `"tools menu: 6 items (directory + 4 sections + copy location + share)"`.

- [ ] **Step 4: Run the test until green**

Run: `bun run test`
Expected: `ALL PASS` and exit 0. If any count shifted, investigate whether it's a reskin regression or another stale assertion; fix stale ones to match the real app.

- [ ] **Step 5: Re-run test with the dev server's live-reload bypass**

Run: `bun run test` again — confirm stable (idempotent). No commit.

---

### Task 5: Docs — DESIGN.md, README.md, AGENTS.md, spec/plan cleanup

**Files:**
- Modify: `DESIGN.md` (Local Adaptations section), `README.md` (Files table + font note), `AGENTS.md` (design-system bullet), `pringle-info.md` (design system section)

**Interfaces:**
- Consumes: final palette + type from Tasks 1–3.

- [ ] **Step 1: `DESIGN.md` — update Local Adaptations**

Rewrite the two paragraphs under `## Local Adaptations (Overstrand Lifeline)` (lines ~502–516) to describe The Shore system:
- Replace "one blue accent (`primary` ~`#0075de`)" with the sage-teal ramp `#2E6E62` / `#22544B` / `#7FBFB2` / `#E6EFEC`.
- Replace the Space Grotesk paragraph with the three-face system: **Fraunces** (display serif — wordmark, headings, section & category titles), **Space Mono** (numerals — every dialable number, counts, badges), **Instrument Sans** (body + phone-number labels). All self-hosted in `fonts/`.
- Keep crisis-red-only-for-emergency, amber warnings, green WhatsApp rows, emoji-free inline SVG, no coordinates, mobile-first.

- [ ] **Step 2: `README.md` — font + design note**

- In the Files table, update the `fonts/` row: "Self-hosted display + numeral fonts (Fraunces, Space Mono, Instrument Sans woff2) — keeps the look branded offline".
- Under "Adding or editing a number" or a design line: add one sentence — "Design follows `DESIGN.md` — The Shore system: warm sand canvas, sage-teal chrome, crisis red for emergency calls, Fraunces/Space Mono/Instrument Sans type."

- [ ] **Step 3: `AGENTS.md` — update the design-system preference bullet**

Replace the bullet "The app follows the Notion-inspired design system in `DESIGN.md` (warm paper canvas, near-black ink type, hairline borders, one blue accent for chrome)…" with The Shore system: warm sand canvas `#F5F2EC`, near-black ink `#26221B`, hairline borders, **sage-teal** `#2E6E62` chrome accent. Crisis red stays for emergency actions. Display headings use self-hosted **Fraunces**; numerals use **Space Mono**; body stays **Instrument Sans** (fonts/). Keep the rest of that bullet (crisis red rules) intact.

- [ ] **Step 4: `pringle-info.md` — design system section**

Update the "Design system" bullets to match: sage-teal accent, three-face type system, warm sand palette. Keep emoji-free / mobile-first / no-coordinates bullets.

- [ ] **Step 5: Final full verification**

Run: `bun run build` (clean) and `bun run test`.
Expected: build exit 0; test `ALL PASS`.
Then a manual phone-viewport check (390×844): no horizontal scroll, thumb targets, both themes, search + accordion + dial + WhatsApp + mail + nav rows all render. Confirm no console errors.

No commit.

---

### Task 6: Final review & mobile check

**Files:** (none — verification only)

- [ ] **Step 1: Confirm the anti-AI checklist**

Walk `index.html` + `tailwind.css` and confirm none of these remain:
- `backdrop-blur` (header/banner) — gone (Task 3).
- Inter / Space Grotesk — gone from config, CSS, HTML links, sw precache.
- `#0075de` blue — gone.
- Emojis / coordinates in data or UI — untouched (unchanged from before).

- [ ] **Step 2: Run the full suite one final time**

Run: `bun run build && bun run test`
Expected: build exit 0; test `ALL PASS`; no console errors.

- [ ] **Step 3: Report**

Summarize what changed, note the pre-existing stale-test repair, and confirm nothing was committed.