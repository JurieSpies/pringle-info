// Pringle Info smoke test — `bun run test` (server must be running: `bun run dev`)
// Playwright checks: rendering, tools menu, search, favourites, WhatsApp, offline PWA.
import { chromium } from "playwright";

// ?hot=0 asks the dev server not to inject its live-reload script and to leave
// the service worker alone — production parity, so the offline checks are real.
const BASE = (process.env.BASE_URL || "http://localhost:8080") + "?hot=0";
const failures: string[] = [];
const assert = (cond: boolean, label: string) => {
    console.log(`${cond ? "PASS" : "FAIL"}  ${label}`);
    if (!cond) failures.push(label);
};

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });

const page = await ctx.newPage();
const errors: string[] = [];
page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
});
page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));

await page.goto(BASE, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);

// ---- rendering (contacts view) ----
assert(
    (await page.locator("details.cat[id]").count()) === 13,
    "13 sections (10 contacts + 3 tools)",
);
assert(
    (await page.locator("article[data-q]").count()) === 106,
    "106 contact cards",
);
assert(
    (await page.locator("#lifelineGrid a").count()) === 4,
    "lifeline: 4 one-tap tiles",
);
assert((await page.locator('a[href^="tel:"]').count()) === 143, "tel: links");
assert(
    (await page.locator('a[href^="https://wa.me/"]').count()) === 62,
    "WhatsApp links (mobile numbers only)",
);

// ---- tools & guides menu ----
assert(
    await page.locator("#menuDropdown").isHidden(),
    "tools menu: hidden by default",
);
await page.click("#menuBtn");
await page.waitForTimeout(200);
assert(
    await page.locator("#menuDropdown").isVisible(),
    "tools menu: burger opens dropdown",
);
assert(
    await page.evaluate(() => {
        const zi = (s: string) =>
            Number(
                getComputedStyle(document.querySelector(s) as HTMLElement)
                    .zIndex,
            ) || 0;
        return zi("#menuDropdown") > zi("#searchRow");
    }),
    "tools menu: dropdown paints above the search bar",
);
assert(
    (await page.locator("#menuDropdown [data-action]").count()) === 4,
    "tools menu: 4 items (directory + 3 sections)",
);
await page.locator('#menuDropdown [data-action="firstaid"]').click();
await page.waitForTimeout(300);
assert(
    await page.locator("#menuDropdown").isHidden(),
    "tools menu: closes after picking",
);
assert(
    await page.locator("#toolsPanel").isVisible(),
    "tools view: panel visible",
);
assert(
    await page.locator("#cat-firstaid").isVisible(),
    "tools view: first aid section shown",
);
assert(
    await page.locator("#cat-checklist").isVisible(),
    "tools view: checklist section shown",
);
assert(
    await page.locator("#results").isHidden(),
    "tools view: contacts hidden",
);
assert(
    (await page.locator("#cat-firstaid").innerText()).includes(
        "not a substitute for trained care",
    ),
    "first aid: disclaimer shown",
);
assert(
    (await page.locator("#cat-firstaid details.cat").count()) === 19,
    "first aid: 19 expandable guides",
);

// ---- tools search ----
await page.fill("#toolsSearch", "aspirin");
await page.waitForTimeout(300);
assert(
    (await page.locator("#cat-firstaid details.cat:not([hidden])").count()) ===
        3,
    "tools search 'aspirin' → 3 first-aid guides (heart attack, stroke, head injury)",
);
assert(
    await page.locator("#cat-helplines").isHidden(),
    "tools search: helplines hidden when no match",
);
await page.fill("#toolsSearch", "poison");
await page.waitForTimeout(300);
assert(
    (await page
        .locator("#cat-helplines article[data-q]:not([hidden])")
        .count()) >= 1,
    "tools search 'poison' → Poisons helpline shown",
);
await page.fill("#toolsSearch", "");
await page.waitForTimeout(300);
assert(
    (await page.locator("#cat-firstaid details.cat:not([hidden])").count()) ===
        19,
    "tools search: cleared → all guides back",
);
assert(
    (await page.locator("#cat-helplines article[data-q]").count()) === 9,
    "helplines: 9 national numbers",
);

// ---- back to directory via menu ----
await page.click("#menuBtn");
await page.waitForTimeout(200);
await page.locator('#menuDropdown [data-action="contacts"]').click();
await page.waitForTimeout(300);
assert(
    await page.locator("#toolsPanel").isHidden(),
    "tools menu: directory item closes tools view",
);
assert(await page.locator("#results").isVisible(), "tools menu: contacts back");

// ---- search ----
await page.fill("#search", "Snake");
await page.waitForTimeout(300);
assert(
    (await page.locator("#results details.cat[id]:not([hidden])").count()) ===
        1,
    "search 'Snake' → 1 category",
);
await page.fill("#search", "");
await page.waitForTimeout(300);

// ---- favourites ----
await page.locator('.star[data-fav="best"]').first().click();
await page.waitForTimeout(300);
assert(
    await page.locator("#favSection").isVisible(),
    "favourites: Quick Access visible",
);
assert(
    (await page.locator("#favList article").count()) === 1,
    "favourites: pinned card shown",
);
await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(1200);
assert(
    (await page.locator("#favList article").count()) === 1,
    "favourites: persists after reload",
);

// ---- local-first (my area) ----
await ctx.grantPermissions(["geolocation"], {
    origin: "http://localhost:8080",
});
await ctx.setGeolocation({ latitude: -34.35, longitude: 18.83, accuracy: 100 });
await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(1500);
assert(
    (await page.locator("#areaSelect").inputValue()) === "pringle",
    "local-first: location auto-detects Pringle Bay",
);
let pharm = await page.locator("#cat-pharmacies article h3").allTextContents(); // textContent: cards are inside a collapsed <details>
assert(
    pharm[0] === "Pringle Bay Pharmacy",
    "local-first: local pharmacy first in Pringle Bay",
);
assert(
    pharm[pharm.length - 1] !== "Pringle Bay Pharmacy",
    "local-first: out-of-area entries stay below",
);

await page.selectOption("#areaSelect", "bettys");
await page.waitForTimeout(300);
pharm = await page.locator("#cat-pharmacies article h3").allTextContents();
assert(
    pharm[0] === "Pharmacy Betty's Bay",
    "local-first: switching area re-sorts instantly",
);

await page.selectOption("#areaSelect", "");
await page.waitForTimeout(300);
pharm = await page.locator("#cat-pharmacies article h3").allTextContents();
assert(
    pharm[0] === "Pharmacy Betty's Bay" && pharm[1] === "Pringle Bay Pharmacy",
    "local-first: 'Off' restores the default order",
);

// ---- offline (service worker) ----
await page.waitForFunction(
    "navigator.serviceWorker.controller !== null",
    undefined,
    { timeout: 5000 },
);
await ctx.setOffline(true);
await page.reload({ waitUntil: "domcontentloaded" });
await page.waitForTimeout(2500);
const offlineResults = await page.locator("#results article[data-q]").count();
const offlineTools = await page.locator("#toolsBody article[data-q]").count();
console.log(
    "  (offline #results:",
    offlineResults,
    "· tools:",
    offlineTools,
    "· title:",
    await page.title(),
    ")",
);
assert(
    offlineResults === 78 && offlineTools === 28,
    "offline reload: contacts + tools fully render",
);
await ctx.setOffline(false);

assert(
    errors.length === 0,
    `no console errors${errors.length ? ` — ${errors.join(" | ")}` : ""}`,
);

await browser.close();
console.log(failures.length ? `\n${failures.length} FAILURE(S)` : "\nALL PASS");
process.exit(failures.length ? 1 : 0);
