// Overstrand Lifeline smoke test — `bun run test` (server must be running: `bun run dev`)
// Playwright checks: rendering, tools menu, location sharing, search, favourites, WhatsApp, offline PWA.
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
// ---- lifeline (single collapsible section) ----
assert(
    (await page.locator("#lifelineGrid details").count()) === 1,
    "lifeline: one collapsible section",
);
assert(
    (await page.locator("#lifelineGrid a[href^='tel:']").count()) === 8,
    "lifeline: 4 direct-dial numbers + 4 call buttons",
);
assert((await page.locator('a[href^="tel:"]').count()) === 147, "tel: links");
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
assert(
    (await page.locator('a[href^="https://wa.me/"]').count()) === 62,
    "WhatsApp links (mobile numbers only)",
);

// ---- bottom navigation tabs ----
assert(
    (await page.locator("#bottomNav [data-tab]").count()) === 4,
    "bottom nav: 4 tabs",
);
assert(
    (await page.locator('#bottomNav [data-tab="directory"] span').innerText()) ===
        "Directory" &&
        (await page.locator('#bottomNav [data-tab="checklist"] span').innerText()) ===
            "Checklist" &&
        (await page.locator('#bottomNav [data-tab="firstaid"] span').innerText()) ===
            "First Aid" &&
        (await page.locator('#bottomNav [data-tab="helplines"] span').innerText()) ===
            "Helplines",
    "bottom nav: tabs carry visible names",
);
assert(
    await page.locator("#menuDropdown").isHidden(),
    "burger: hidden by default",
);
await page.click("#menuBtn");
await page.waitForTimeout(200);
assert(
    await page.locator("#menuDropdown").isVisible(),
    "burger: opens dropdown",
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
    "burger: dropdown paints above the search bar",
);
assert(
    (await page.locator("#menuDropdown [data-action]").count()) === 2,
    "burger: 2 items (copy location + share)",
);
await page.click("#menuBtn");
await page.waitForTimeout(200);

// ---- First Aid tab ----
await page.click('#bottomNav [data-tab="firstaid"]');
await page.waitForTimeout(300);
assert(
    await page.locator("#toolsPanel").isVisible(),
    "tab: tools panel visible on First Aid",
);
assert(
    await page.locator("#cat-firstaid").isVisible(),
    "tab: first aid section shown",
);
assert(
    await page.locator("#cat-checklist").isHidden(),
    "tab: checklist section hidden on First Aid",
);
assert(
    await page.locator("#results").isHidden(),
    "tab: contacts hidden on First Aid",
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

// ---- tools search (filters the active tab only) ----
await page.fill("#toolsSearch", "aspirin");
await page.waitForTimeout(300);
assert(
    (await page.locator("#cat-firstaid details.cat:not([hidden])").count()) ===
        3,
    "first-aid search 'aspirin' → 3 guides (heart attack, stroke, head injury)",
);
await page.fill("#toolsSearch", "");
await page.waitForTimeout(300);
assert(
    (await page.locator("#cat-firstaid details.cat:not([hidden])").count()) ===
        19,
    "first-aid search: cleared → all guides back",
);

// ---- Helplines tab ----
await page.click('#bottomNav [data-tab="helplines"]');
await page.waitForTimeout(300);
assert(
    await page.locator("#cat-helplines").isVisible(),
    "tab: helplines section shown",
);
assert(
    (await page.locator("#cat-helplines article[data-q]").count()) === 9,
    "helplines: 9 national numbers",
);
await page.fill("#toolsSearch", "poison");
await page.waitForTimeout(300);
assert(
    (await page
        .locator("#cat-helplines article[data-q]:not([hidden])")
        .count()) >= 1,
    "helplines search 'poison' → Poisons helpline shown",
);
await page.fill("#toolsSearch", "");
await page.waitForTimeout(300);

// ---- back to directory via tab ----
await page.click('#bottomNav [data-tab="directory"]');
await page.waitForTimeout(300);
assert(
    await page.locator("#toolsPanel").isHidden(),
    "tab: Directory closes tools panel",
);
assert(await page.locator("#results").isVisible(), "tab: Directory shows contacts");

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
// All sections start collapsed — open the top emergency section first.
await page.click("#cat-response summary");
await page.waitForTimeout(200);
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
await ctx.grantPermissions(
    ["geolocation", "clipboard-read", "clipboard-write"],
    { origin: "http://localhost:8080" },
);
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

// ---- copy my location (burger menu) ----
await page.click("#menuBtn");
await page.waitForTimeout(200);
await page.locator('#menuDropdown [data-action="location"]').click();
await page.waitForTimeout(400);
assert(
    (await page.evaluate(() => navigator.clipboard.readText())) ===
        "https://maps.google.com/?q=-34.350000,18.830000",
    "copy location: shareable map link copied (granted Pringle Bay coords)",
);
assert(
    await page.locator("#toast").isVisible(),
    "copy location: confirmation toast shown",
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
